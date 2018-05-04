import {Directive, ElementRef, forwardRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';
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
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {fromEvent} from 'rxjs/observable/fromEvent';
import {of} from 'rxjs/observable/of';
import {map, take} from 'rxjs/operators';
import {ReplaySubject} from 'rxjs/ReplaySubject';
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
export class FileInputAccessor implements ControlValueAccessor, AsyncValidator, OnChanges {
    @Input() allowedExt: RegExp | string | string[];
    @Input() allowedTypes: RegExp | string | string[];
    @Input() size: number;
    @Input() withMeta: boolean;
    @Input() maxHeight: number;
    @Input() maxWidth: number;

    @HostListener('change', ['$event.target.files']) onChange = (_: any) => {};
    @HostListener('blur') onTouched = () => {};

    validator: AsyncValidatorFn;

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {
        this.validator = this.generateAsyncValidator();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.fileList && changes.fileList.currentValue.length === 0) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', []);
        }
    }

    writeValue(value: any) {
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
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

    private generateAsyncValidator(): (c: FormControl) => Observable<ValidationErrors | null> {
        return (c: FormControl): Observable<ValidationErrors> => {
            if (!c.value || !c.value.length || c.disabled) return of({});

            const errors: ValidationErrors = {};
            const loaders: ReplaySubject<ProgressEvent>[] = [];

            for (const f of c.value) {
                if (this.size && this.size < f.size) {
                    f.errors['fileSize'] = true;
                    errors['fileSize'] = true;
                }

                if (f.isImg && (this.maxWidth || this.maxHeight)) {
                    loaders.push(
                        f.imgLoadReplay
                            .pipe(
                                take(1),
                                map((e: ProgressEvent) => {
                                    if (this.maxWidth && f.imgWidth > this.maxWidth) {
                                        f.errors['imageWidth'] = true;
                                        errors['imageWidth'] = true;
                                    }
                                    if (this.maxHeight && f.imgHeight > this.maxHeight) {
                                        f.errors['imageHeight'] = true;
                                        errors['imageHeight'] = true;
                                    }
                                    return e;
                                }))
                    );
                }

                if (!this.allowedExt && !this.allowedTypes) continue;

                const extP = this.generateRegExp(this.allowedExt);
                const typeP = this.generateRegExp(this.allowedTypes);

                if (extP && !extP.test(f.name)) {
                    f.errors['fileExt'] = true;
                    errors['fileExt'] = true;
                }

                if (typeP && !typeP.test(f.type)) {
                    f.errors['fileType'] = true;
                    errors['fileType'] = true;
                }
            }
            if (loaders.length) {
                return forkJoin(...loaders)
                    .pipe(
                        map(() => {
                            return errors;
                        }));
            }
            return of(errors);
        }
    };

    private onChangeGenerator(fn: (_: any) => {}): (_: ICustomFile[]) => void {
        return (files: ICustomFile[]) => {
            const fileArr: File[] = [];

            if (!files || !files.length) {
                this._renderer.setProperty(this._elementRef.nativeElement, 'value', []);
                return fn(fileArr);
            }

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
    };

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
        const imgLoadObs = fromEvent(img, 'load')
            .pipe(
                take(1),
                map((e: ProgressEvent) => {
                    f.imgHeight = img.height;
                    f.imgWidth = img.width;
                    return e;
                }));

        const frLoadObs = fromEvent(fr, 'load')
            .pipe(
                take(1),
                map((e: ProgressEvent) => {
                    f.imgSrc = fr.result;
                    img.src = fr.result;
                    return e;
                }));

        const onloadReplay = new ReplaySubject(1);
        forkJoin(imgLoadObs, frLoadObs).subscribe(onloadReplay);

        fr.readAsDataURL(f);

        return onloadReplay;
    }

    private setText(f: ICustomFile, fr: FileReader): ReplaySubject<[Event, ProgressEvent]> {
        const onloadReplay = new ReplaySubject(1);
        fromEvent(fr, 'load')
            .pipe(
                take(1),
                map((e: ProgressEvent) => {
                    f.textContent = fr.result;
                    return [e];
                }))
            .subscribe(onloadReplay);

        fr.readAsText(f);

        return onloadReplay;
    }
}
