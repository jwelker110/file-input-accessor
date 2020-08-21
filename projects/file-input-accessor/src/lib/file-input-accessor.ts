import {Directive, ElementRef, forwardRef, HostListener, Input, Renderer2} from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    AsyncValidatorFn,
    ControlValueAccessor,
    FormControl,
    NG_ASYNC_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors
} from '@angular/forms';

import {forkJoin, fromEventPattern, Observable, of, ReplaySubject} from 'rxjs';
import {first, map, shareReplay, take} from 'rxjs/operators';
import {ICustomFile} from './interfaces';


@Directive({
    selector: 'input[type=file][formControl],input[type=file][formControlName],input[type=file][ngModel]',
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
    @Input() allowedTypes: RegExp | string | string[];

    @Input() size: number;

    @Input() withMeta: boolean;

    @Input() maxHeight: number;

    @Input() maxWidth: number;

    @Input() minHeight: number;

    @Input() minWidth: number;

    @Input()
    set allowedExt(value: RegExp | string | string[]) {
        if (typeof value === 'string') {
            value = value + '$';
        }
        if (value instanceof Array) {
            value = value.join('|') + '$';
        }
        this._allowedExt = value;
    }

    get allowedExt(): RegExp | string | string[] {
        return this._allowedExt;
    }

    validator: AsyncValidatorFn;

    private _allowedExt: RegExp | string | string[];

    @HostListener('change', ['$event.target.files']) onChange = (_: any) => {};
    @HostListener('blur') onTouched = () => {};

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {
        this.validator = this.generateAsyncValidator();
    }

    writeValue(value: any) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', null);
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = this.onChangeGenerator(fn);
    }

    registerOnTouched(fn: () => {}): void {}

    setDisabledState(isDisabled: boolean): void {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }

    validate(c: AbstractControl): Observable<ValidationErrors | null> | Promise<ValidationErrors | null> {
        return this.validator(c);
    }

    /**
     * Generator method that I used to move the code for the AsyncValidator down here so it didn't
     * get in my way, way up there ^.
     */
    private generateAsyncValidator(): AsyncValidatorFn {
        return (c: FormControl): Observable<ValidationErrors> => {
            if (!c.value || !c.value.length || c.disabled) return of({});

            const errors: ValidationErrors = {};
            const loaders: ReplaySubject<ProgressEvent>[] = [];

            for (const f of c.value) {
                if (this.size && this.size < f.size) {
                    f.errors.fileSize = true;
                    errors.fileSize = true;
                }

                if (f.isImg && (this.maxWidth || this.maxHeight || this.minWidth || this.minHeight)) {
                    loaders.push(
                        f.imgLoadReplay
                            .pipe(
                                take(1),
                                map((e: ProgressEvent) => {
                                    const minWidthError = this.minWidth && f.imgWidth < this.minWidth;
                                    const minHeightError = this.minHeight && f.imgHeight < this.minHeight;
                                    const maxWidthError = this.maxWidth && f.imgWidth > this.maxWidth;
                                    const maxHeightError = this.maxHeight && f.imgHeight > this.maxHeight;

                                    if (minWidthError) {
                                        f.errors.minWidth = true;
                                        errors.minWidth = true;
                                    }

                                    if (minHeightError) {
                                        f.errors.minHeight = true;
                                        errors.minHeight = true;
                                    }

                                    if (maxWidthError) {
                                        f.errors.maxWidth = true;
                                        errors.maxWidth = true;
                                    }

                                    if (maxHeightError) {
                                        f.errors.maxHeight = true;
                                        errors.maxHeight = true;
                                    }

                                    /** will be @deprecated **/
                                    if (minWidthError || maxWidthError) {
                                        f.errors.imageWidth = true;
                                        errors.imageWidth = true;
                                    }

                                    /** will be @deprecated **/
                                    if (minHeightError || maxHeightError) {
                                        f.errors.imageHeight = true;
                                        errors.imageHeight = true;
                                    }

                                    return e;
                                }))
                    );
                }

                if (!this.allowedExt && !this.allowedTypes) continue;

                const extP = this.generateRegExp(this.allowedExt);
                const typeP = this.generateRegExp(this.allowedTypes);

                if (extP && !extP.test(f.name)) {
                    f.errors.fileExt = true;
                    errors.fileExt = true;
                }

                if (typeP && !typeP.test(f.type)) {
                    f.errors.fileType = true;
                    errors.fileType = true;
                }
            }
            if (loaders.length) {
                return forkJoin(...loaders).pipe(map(() => errors));
            }
            return of(errors);
        };
    }

    /**
     * Generator method that returns an onChange handler
     */
    private onChangeGenerator(fn: (_: any) => {}): (_: ICustomFile[]) => void {
        return (files: ICustomFile[]) => {
            const fileArr: File[] = [];

            for (const f of files) {
                if (this.withMeta && FileReader) {
                    const fr = new FileReader();
                    this.generateFileMeta(f, fr);
                }
                f.errors = {};
                fileArr.push(f);
            }
            fn(fileArr);
        };
    }

    private generateRegExp(pattern: RegExp | string | string[]): RegExp | null {
        if (!pattern) return null;

        if (pattern instanceof RegExp) {
            return new RegExp(pattern);
        } else if (typeof pattern === 'string') {
            return new RegExp(pattern, 'ig');
        } else if (pattern instanceof Array) {
            return new RegExp(`(${pattern.join('|')})`, 'ig');
        }
        return null;
    }

    /**
     * The ICustomFile has a ReplaySubject property for text / image files that will emit
     * once the file has been loaded. Might get removed later since I haven't found a use for it yet.
     */
    private generateFileMeta(f: ICustomFile, fr: FileReader) {
        if (f.type.match(/text.*/)) {
            f.textLoadReplay = this.setText(f, fr);
        } else if (f.type.match(/image.*/)) {
            f.imgLoadReplay = this.setImage(f, fr);
        }
    }

    private setImage(f: ICustomFile, fr: FileReader): ReplaySubject<[Event, ProgressEvent]> {
        f.isImg = true;

        const img = new Image();

        const imgLoadObs = fromEventPattern<Event>(
            ((handler: any) => img.addEventListener('load', handler)),
            ((handler: any) => img.removeEventListener('load', handler))
        ).pipe(
            take(1),
            shareReplay()
        );

        const frLoadObs = fromEventPattern<ProgressEvent>(
            ((handler: any) => fr.addEventListener('load', handler)),
            ((handler: any) => fr.removeEventListener('load', handler))
        ).pipe(
            take(1),
            shareReplay()
        );

        const onloadReplay = new ReplaySubject<[Event, ProgressEvent]>(1);
        forkJoin([imgLoadObs, frLoadObs]).pipe(first()).subscribe(onloadReplay);

        imgLoadObs.pipe(first()).subscribe(() => {
            f.imgHeight = img.height;
            f.imgWidth = img.width;
        });

        frLoadObs.pipe(first()).subscribe(() => {
            f.imgSrc = fr.result + '';
            img.src = fr.result + '';
        });

        fr.readAsDataURL(f);

        return onloadReplay;
    }

    private setText(f: ICustomFile, fr: FileReader): ReplaySubject<ProgressEvent> {
        const frLoadObs = fromEventPattern<ProgressEvent>(
            ((handler: any) => fr.addEventListener('load', handler)),
            ((handler: any ) => fr.removeEventListener('load', handler))
        ).pipe(
            take(1),
            shareReplay()
        );

        const onloadReplay = new ReplaySubject<ProgressEvent>(1);
        frLoadObs.subscribe(onloadReplay);

        frLoadObs.pipe(first()).subscribe(() => {
            f.textContent = fr.result + '';
        });

        fr.readAsText(f);

        return onloadReplay;
    }
}
