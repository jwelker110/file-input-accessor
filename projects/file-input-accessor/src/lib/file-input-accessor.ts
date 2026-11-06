import {Directive, ElementRef, forwardRef, inject, input, Renderer2} from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    ControlValueAccessor,
    NG_ASYNC_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors
} from '@angular/forms';

import {forkJoin, fromEventPattern, Observable, of, ReplaySubject} from 'rxjs';
import {first, map, shareReplay, take} from 'rxjs/operators';
import {ICustomFile} from './interfaces';

type Pattern = RegExp | string | string[];

@Directive({
    selector: 'input[type=file][formControl],input[type=file][formControlName],input[type=file][ngModel]',
    host: {
        '(change)': 'onInputChange()',
        '(blur)': 'onTouched()'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileInputAccessor),
            multi: true
        },
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => FileInputAccessor),
            multi: true
        }
    ]
})
export class FileInputAccessor implements ControlValueAccessor, AsyncValidator {
    readonly allowedTypes = input<Pattern>();
    readonly allowedExt = input<Pattern>();
    readonly size = input<number>();
    readonly withMeta = input<boolean>();
    readonly maxHeight = input<number>();
    readonly maxWidth = input<number>();
    readonly minHeight = input<number>();
    readonly minWidth = input<number>();

    private readonly renderer = inject(Renderer2);
    private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);

    onChange: (files: ICustomFile[] | FileList) => void = () => {};
    onTouched: () => void = () => {};

    onInputChange(): void {
        this.onChange(this.elementRef.nativeElement.files ?? []);
    }

    writeValue(_value: unknown): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', null);
    }

    registerOnChange(fn: (files: ICustomFile[]) => void): void {
        this.onChange = this.buildOnChange(fn);
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const files: ICustomFile[] | null = control.value;
        if (!files || !files.length || control.disabled) {
            return of({});
        }

        const errors: ValidationErrors = {};
        const pendingImageChecks: Observable<unknown>[] = [];
        const maxSize = this.size();
        const allowedExt = this.allowedExt();
        const allowedTypes = this.allowedTypes();
        const hasImageBounds = !!(this.maxWidth() || this.maxHeight() || this.minWidth() || this.minHeight());

        for (const file of files) {
            const fileErrors = file.errors ??= {};
            if (maxSize && file.size > maxSize) {
                fileErrors.fileSize = true;
                errors.fileSize = true;
            }
            // RegExp is recreated per file because patterns produced from `[]` carry the `g`
            // flag, whose `lastIndex` state would otherwise leak across files.
            const extPattern = this.toRegExp(allowedExt, true);
            const typePattern = this.toRegExp(allowedTypes, false);
            if (extPattern && !extPattern.test(file.name)) {
                fileErrors.fileExt = true;
                errors.fileExt = true;
            }
            if (typePattern && !typePattern.test(file.type)) {
                fileErrors.fileType = true;
                errors.fileType = true;
            }
            if (hasImageBounds && file.isImg && file.imgLoadReplay) {
                pendingImageChecks.push(
                    file.imgLoadReplay.pipe(
                        take(1),
                        map(() => this.applyImageBoundErrors(file, errors))
                    )
                );
            }
        }

        if (pendingImageChecks.length) {
            return forkJoin(pendingImageChecks).pipe(map(() => errors));
        }
        return of(errors);
    }

    private buildOnChange(fn: (files: ICustomFile[]) => void): (files: ICustomFile[] | FileList) => void {
        return (files) => {
            const withMeta = this.withMeta();
            const fileArr: ICustomFile[] = [];

            for (const file of Array.from(files) as ICustomFile[]) {
                file.errors = {};
                if (withMeta) {
                    this.generateFileMeta(file);
                }
                fileArr.push(file);
            }
            fn(fileArr);
        };
    }

    private applyImageBoundErrors(file: ICustomFile, errors: ValidationErrors): void {
        const {imgWidth, imgHeight} = file;
        if (imgWidth == null || imgHeight == null) return;

        const fileErrors = file.errors ??= {};
        const minW = this.minWidth();
        const minH = this.minHeight();
        const maxW = this.maxWidth();
        const maxH = this.maxHeight();

        const minWidthError = !!minW && imgWidth < minW;
        const minHeightError = !!minH && imgHeight < minH;
        const maxWidthError = !!maxW && imgWidth > maxW;
        const maxHeightError = !!maxH && imgHeight > maxH;

        if (minWidthError) {
            fileErrors.minWidth = true;
            errors.minWidth = true;
        }
        if (minHeightError) {
            fileErrors.minHeight = true;
            errors.minHeight = true;
        }
        if (maxWidthError) {
            fileErrors.maxWidth = true;
            errors.maxWidth = true;
        }
        if (maxHeightError) {
            fileErrors.maxHeight = true;
            errors.maxHeight = true;
        }

        // imageWidth/imageHeight are deprecated aliases kept for backwards compatibility.
        if (minWidthError || maxWidthError) {
            fileErrors.imageWidth = true;
            errors.imageWidth = true;
        }
        if (minHeightError || maxHeightError) {
            fileErrors.imageHeight = true;
            errors.imageHeight = true;
        }
    }

    private toRegExp(pattern: Pattern | undefined, anchorAtEnd: boolean): RegExp | null {
        if (!pattern) return null;
        if (pattern instanceof RegExp) return new RegExp(pattern);

        const body = Array.isArray(pattern) ? `(${pattern.join('|')})` : pattern;
        return new RegExp(anchorAtEnd ? `${body}$` : body, 'ig');
    }

    private generateFileMeta(file: ICustomFile): void {
        if (typeof FileReader === 'undefined') return;

        const reader = new FileReader();
        if (file.type.startsWith('text')) {
            file.textLoadReplay = this.readText(file, reader);
        } else if (file.type.startsWith('image')) {
            file.imgLoadReplay = this.readImage(file, reader);
        }
    }

    private readImage(file: ICustomFile, reader: FileReader): ReplaySubject<[Event, ProgressEvent]> {
        file.isImg = true;

        const img = new Image();

        const imgLoadObs = fromEventPattern<Event>(
            (handler) => img.addEventListener('load', handler),
            (handler) => img.removeEventListener('load', handler)
        ).pipe(take(1), shareReplay(1));

        const frLoadObs = fromEventPattern<ProgressEvent>(
            (handler) => reader.addEventListener('load', handler),
            (handler) => reader.removeEventListener('load', handler)
        ).pipe(take(1), shareReplay(1));

        const onLoadReplay = new ReplaySubject<[Event, ProgressEvent]>(1);
        forkJoin([imgLoadObs, frLoadObs]).pipe(first()).subscribe(onLoadReplay);

        imgLoadObs.subscribe(() => {
            file.imgHeight = img.height;
            file.imgWidth = img.width;
        });

        frLoadObs.subscribe(() => {
            const src = String(reader.result);
            file.imgSrc = src;
            img.src = src;
        });

        reader.readAsDataURL(file);

        return onLoadReplay;
    }

    private readText(file: ICustomFile, reader: FileReader): ReplaySubject<ProgressEvent> {
        const frLoadObs = fromEventPattern<ProgressEvent>(
            (handler) => reader.addEventListener('load', handler),
            (handler) => reader.removeEventListener('load', handler)
        ).pipe(take(1), shareReplay(1));

        const onLoadReplay = new ReplaySubject<ProgressEvent>(1);
        frLoadObs.subscribe(onLoadReplay);
        frLoadObs.subscribe(() => {
            file.textContent = String(reader.result);
        });

        reader.readAsText(file);

        return onLoadReplay;
    }
}
