import {Directive, ElementRef, forwardRef, Input, OnChanges, Renderer2, Type} from "@angular/core";
import {
    AsyncValidator,
    AsyncValidatorFn,
    ControlValueAccessor,
    FormControl,
    NG_ASYNC_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator
} from "@angular/forms";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/observable/interval";
import "rxjs/add/observable/of";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/operator/take";
import {Observable} from "rxjs/Observable";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {ICustomFile} from "./interfaces";


@Directive({
    selector: 'input[type=file][formControl],input[type=file][formControlName],input[type=file][ngModel]',
    host: {'(change)': 'onChange($event.target.files)', '(blur)': 'onTouched()'},
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
export class FileInputAccessor implements ControlValueAccessor, Validator, AsyncValidator, OnChanges {
    @Input('allowedExt') extPattern: RegExp | string | string[];
    @Input('allowedTypes') typePattern: RegExp | string | string[];
    @Input('size') maxSize: number;
    @Input('withMeta') addMeta: boolean;
    @Input('maxHeight') maxHeight: number;
    @Input('maxWidth') maxWidth: number;

    onChange = (_: any) => {
    };
    onTouched = () => {
    };

    validator: AsyncValidatorFn;

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {
        this.validator = this.generateAsyncValidator();
    }

    ngOnChanges(changes: any) {
        if (changes.fileList && changes.fileList.currentValue.length == 0) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', []);
        }
    }

    writeValue(value: any) {
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    }

    registerOnChange(fn: any): void {
        this.onChange = this.onChangeGenerator(fn);
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        throw new Error("Method not implemented.");
    }

    validate(c: FormControl): Observable<ValidationErrors> | Promise<ValidationErrors> {
        return this.validator(c);
    }

    private generateAsyncValidator(): (c: FormControl) => Observable<ValidationErrors> {
        return (c: FormControl): Observable<ValidationErrors> => {
            if (!c.value || !c.value.length) return Observable.of({});

            let errors: {[key: string]: any} = {};
            let loaders: ReplaySubject<ProgressEvent>[] = [];
            for (let f of c.value) {
                if (this.maxSize && this.maxSize < f.size) {
                    f.errors['fileSize'] = true;
                    errors['fileSize'] = 'File size too large';
                }

                if (f.isImg && (this.maxWidth || this.maxHeight)) {
                    loaders.push(
                        f.imgLoadReplay
                            .take(1)
                            .map((e: ProgressEvent) => {
                                if (this.maxWidth && f.imgWidth > this.maxWidth) {
                                    f.errors['imageWidth'] = true;
                                    errors['imageWidth'] = 'Image is too wide';
                                }
                                if (this.maxHeight && f.imgHeight > this.maxHeight) {
                                    f.errors['imageHeight'] = true;
                                    errors['imageHeight'] = 'Image is too tall';
                                }
                                return e;
                            })
                    );
                }

                if (!this.extPattern && !this.typePattern) continue;

                let extP = this.generateRegExp(this.extPattern);
                let typeP = this.generateRegExp(this.typePattern);

                if ((extP && !extP.test(f.name)) || (typeP && !typeP.test(f.type))) {
                    f.errors['fileType'] = true;
                    errors['fileType'] = 'File type not allowed';
                }
            }
            if (loaders.length) {
                return Observable
                    .forkJoin(...loaders)
                    .map((loadResults) => {
                        return errors;
                    });
            }
            return Observable.of(errors);
        }
    };

    private onChangeGenerator(fn: (_:any) => {}): (_: any) => {} {
        return (files: ICustomFile[]) => {
            let fileArr: File[] = [];

            if (!files || !files.length) {
                this._renderer.setProperty(this._elementRef.nativeElement, 'value', []);
                return fn(fileArr);
            }

            for (let f of files) {
                if (this.addMeta && FileReader) {
                    let fr = new FileReader();
                    this.generateFileMeta(f, fr);
                }
                f.errors = {};
                fileArr.push(f);
            }
            return fn(fileArr);
        };
    };

    private generateRegExp(pattern: RegExp | string | string[]) {
        if (!pattern) return;

        if (pattern instanceof RegExp) {
            return new RegExp(pattern);
        } else if (typeof pattern === 'string') {
            return new RegExp(pattern, 'ig');
        } else if (pattern instanceof Array) {
            return new RegExp(`(${pattern.join('|')})`, 'ig');
        }
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

        let img = new Image();
        let imgLoadObs = Observable.fromEvent(img, 'load')
            .take(1)
            .map((e: ProgressEvent) => {
                f.imgHeight = img.height;
                f.imgWidth = img.width;
                return e;
            });

        let frLoadObs = Observable.fromEvent(fr, 'load')
            .take(1)
            .map((e: ProgressEvent) => {
                f.imgSrc = fr.result;
                img.src = fr.result;
                return e;
            });

        let onloadReplay = new ReplaySubject(1);
        Observable
            .forkJoin(
                imgLoadObs,
                frLoadObs
            )
            .subscribe(onloadReplay);
        fr.readAsDataURL(f);

        return onloadReplay;
    }

    private setText(f: ICustomFile, fr: FileReader): ReplaySubject<[Event, ProgressEvent]> {
        let onloadReplay = new ReplaySubject(1);
        Observable.fromEvent(fr, 'load')
            .map((e: ProgressEvent) => {
                f.textContent = fr.result;
                return [e];
            })
            .subscribe(onloadReplay);
        fr.readAsText(f);

        return onloadReplay;
    }
}

// export function forwardRefFunction(): Type<any> {
//     return forwardRef(() => FileInputAccessor);
// }