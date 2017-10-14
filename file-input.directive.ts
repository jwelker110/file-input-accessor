import {
    Directive, ElementRef, forwardRef, Input, OnChanges,
    Renderer2
} from "@angular/core";
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";


export interface ICustomFile extends File {
    errors?: string[];
    imgSrc?: string;
    textContent?: string;
}


@Directive({
    selector: 'input[type=file][formControl],input[type=file][formControlName],input[type=file][ngModel]',
    host: {'(change)': 'onChange($event.target.files)', '(blur)': 'onTouched()'},
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FileInputDirective),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FileInputDirective),
            multi: true
        }
    ]
})
export class FileInputDirective implements ControlValueAccessor, OnChanges {
    @Input('allowedExt') extPattern: RegExp | string | string[];
    @Input('allowedTypes') typePattern: RegExp | string | string[];
    @Input('size') maxSize: number;
    @Input('withMeta') addMeta: boolean = false;

    onChange = (_: any) => {};
    onTouched = () => {};
    validator: (c: FormControl) => {} | null;

    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {
        this.validator = this.generateValidator();
    }

    ngOnChanges(changes: any) {
        if(changes.fileList && changes.fileList.currentValue.length == 0) {
            this._renderer.setProperty(this._elementRef.nativeElement, 'value', '');
        }
    }

    writeValue(value: any) {
        const normalizedValue = value == null ? '' : value;
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
    }

    registerOnChange(fn: (_: any) => {} | null): void {
        this.onChange = this.onChangeGenerator(fn);
    }

    registerOnTouched(fn: () => {}): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        throw new Error("Method not implemented.");
    }

    validate(c: FormControl) {
        return this.validator(c);
    }

    generateValidator(): (c: FormControl) => {} | null {
        return (c: FormControl): {} | null => {
            let value = c['value'];
            if (!value || value.length == 0) return {};

            let errors: {[key: string]: string} = {};
            for (let f of value) {
                f.errors = [];
                if (this.maxSize && this.maxSize < f.size) {
                    f.errors.push('File size too large.');
                    errors['fileSize'] = 'File size too large.';
                }

                if (!this.extPattern && !this.typePattern) continue;

                let extP = this.generateRegExp(this.extPattern);
                let typeP = this.generateRegExp(this.typePattern);

                if((extP && !extP.test(f.name)) || (typeP && !typeP.test(f.type))) {
                    f.errors.push('File type not allowed.');
                    errors['fileType'] = 'File type not allowed.';
                }
            }
            return errors;
        };
    };

    onChangeGenerator(fn: (_: any) => {} | null): (_: any) => {} | null {
        return (files: ICustomFile[]) => {
            if (!files) {
                this._renderer.setProperty(this._elementRef.nativeElement, 'value', '');
            }

            if (this.addMeta && FileReader && files && files.length) {
                for (let f of files) {
                    let fr = new FileReader();
                    this.generateFileMeta(f, fr);
                }
            }
            return fn(files);
        };
    };

    generateRegExp(pattern: RegExp | string | string[]) {
        if (!pattern) return;

        if (pattern instanceof RegExp) {
            return new RegExp(pattern);
        } else if (typeof pattern === 'string') {
            return new RegExp(pattern, 'ig');
        } else if (pattern instanceof Array) {
            return new RegExp(`(${pattern.join('|')})`, 'ig');
        }
    }

    generateFileMeta(f: ICustomFile, fr: FileReader) {
        if (f.type.match(/text.*/)) {
            fr.onload = () => {
                f.textContent = fr.result;
            };
            fr.readAsText(f);
        } else if (f.type.match(/image.*/)) {
            fr.onload = () => {
                f.imgSrc = fr.result;
            };
            fr.readAsDataURL(f);
        }
    }
}
