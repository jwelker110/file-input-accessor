import {beforeEach, describe, expect, it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule, ValidationErrors} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {firstValueFrom, Observable} from 'rxjs';
import {FileInputAccessor} from './file-input-accessor';
import {FileInputAccessorModule} from './file-input-accessor.module';
import {ICustomFile} from './interfaces';

type PreparedFile = ICustomFile & Required<Pick<ICustomFile, 'errors'>>;

@Component({
    template: `
        <input type="file" multiple
               [formControl]="control"
               [size]="size"
               [withMeta]="withMeta"
               [allowedExt]="allowedExt"
               [allowedTypes]="allowedTypes"
               [maxHeight]="maxHeight"
               [maxWidth]="maxWidth"
               [minHeight]="minHeight"
               [minWidth]="minWidth"/>
    `,
    imports: [ReactiveFormsModule, FileInputAccessorModule]
})
class HostComponent {
    control = new FormControl();
    size: number | undefined;
    withMeta = false;
    allowedExt: RegExp | string | string[] | undefined;
    allowedTypes: RegExp | string | string[] | undefined;
    maxHeight: number | undefined;
    maxWidth: number | undefined;
    minHeight: number | undefined;
    minWidth: number | undefined;
}


describe('FileInputAccessor', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HostComponent;
    let accessor: FileInputAccessor;
    let inputEl: HTMLInputElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();

        const debugEl = fixture.debugElement.query(By.directive(FileInputAccessor));
        accessor = debugEl.injector.get(FileInputAccessor);
        inputEl = debugEl.nativeElement;
    });


    describe('selector', () => {
        it('attaches to an input[type=file] bound to a form control', () => {
            expect(accessor).toBeTruthy();
            expect(inputEl.tagName).toBe('INPUT');
            expect(inputEl.type).toBe('file');
        });
    });


    describe('writeValue', () => {
        it('resets the native input value', () => {
            accessor.writeValue(null);

            expect(inputEl.value).toBe('');
        });
    });


    describe('registerOnTouched', () => {
        it('invokes the registered callback on blur', () => {
            let touched = false;
            accessor.registerOnTouched(() => { touched = true; });

            inputEl.dispatchEvent(new Event('blur'));

            expect(touched).toBe(true);
        });
    });


    describe('setDisabledState', () => {
        it('disables the native input when called with true', () => {
            accessor.setDisabledState(true);

            expect(inputEl.disabled).toBe(true);
        });

        it('re-enables the native input when called with false', () => {
            accessor.setDisabledState(true);
            accessor.setDisabledState(false);

            expect(inputEl.disabled).toBe(false);
        });
    });


    describe('allowedExt anchoring', () => {
        it('anchors a string pattern at the end of the file name', async () => {
            host.allowedExt = '\\.txt';
            fixture.detectChanges();
            const matching = prepared(makeTextFile('note.txt'));
            const middle = prepared(makeTextFile('note.txt.bak'));
            host.control.setValue([matching, middle]);

            const result = await runValidate(accessor, host.control);

            expect(matching.errors.fileExt).toBeUndefined();
            expect(middle.errors.fileExt).toBe(true);
            expect(result.fileExt).toBe(true);
        });

        it('anchors every entry of an array pattern at the end of the file name', async () => {
            host.allowedExt = ['\\.txt', '\\.md'];
            fixture.detectChanges();
            const endsTxt = prepared(makeTextFile('note.txt'));
            const endsMd = prepared(makeTextFile('note.md', '', 'text/markdown'));
            const middle = prepared(makeTextFile('note.txt.bak'));
            host.control.setValue([endsTxt, endsMd, middle]);

            const result = await runValidate(accessor, host.control);

            expect(endsTxt.errors.fileExt).toBeUndefined();
            expect(endsMd.errors.fileExt).toBeUndefined();
            expect(middle.errors.fileExt).toBe(true);
            expect(result.fileExt).toBe(true);
        });
    });


    describe('onChange handler', () => {
        it('emits the file array with errors initialized on each file', () => {
            const file = makeTextFile('hello.txt');

            accessor.onChange([file]);
            const emitted = host.control.value as ICustomFile[];

            expect(emitted).toEqual([file]);
            expect(emitted[0].errors).toEqual({});
        });

        it('does not enrich files when withMeta is false', () => {
            host.withMeta = false;
            fixture.detectChanges();
            const file = makeTextFile('a.txt', 'hi');

            accessor.onChange([file]);

            expect(file.textLoadReplay).toBeUndefined();
            expect(file.imgLoadReplay).toBeUndefined();
            expect(file.isImg).toBeUndefined();
            expect(file.textContent).toBeUndefined();
        });

        it('reads text content when withMeta is true and the file is text/*', async () => {
            host.withMeta = true;
            fixture.detectChanges();
            const file = makeTextFile('hello.txt', 'hello world');

            accessor.onChange([file]);

            expect(file.textLoadReplay).toBeTruthy();
            await awaitLoad(file.textLoadReplay);
            expect(file.textContent).toBe('hello world');
        });

        it('reads image dimensions and src when withMeta is true and the file is image/*', async () => {
            host.withMeta = true;
            fixture.detectChanges();
            const file = await makePngFile(10, 20);

            accessor.onChange([file]);

            expect(file.isImg).toBe(true);
            expect(file.imgLoadReplay).toBeTruthy();
            await awaitLoad(file.imgLoadReplay);
            expect(file.imgWidth).toBe(10);
            expect(file.imgHeight).toBe(20);
            expect(file.imgSrc).toMatch(/^data:image\/png;base64,/);
        });

        it('does not enrich binary files', () => {
            host.withMeta = true;
            fixture.detectChanges();
            const file = new File([new Uint8Array([1, 2, 3])], 'data.bin', {type: 'application/octet-stream'}) as ICustomFile;

            accessor.onChange([file]);

            expect(file.textLoadReplay).toBeUndefined();
            expect(file.imgLoadReplay).toBeUndefined();
            expect(file.isImg).toBeUndefined();
        });
    });


    describe('validate', () => {
        it('returns an empty errors object when the control has no value', async () => {
            const result = await runValidate(accessor, host.control);

            expect(result).toEqual({});
        });

        it('returns an empty errors object when the control is disabled', async () => {
            host.size = 1;
            fixture.detectChanges();
            const file = prepared(makeTextFile('big.txt', 'too long'));
            host.control.setValue([file]);
            host.control.disable();

            const result = await runValidate(accessor, host.control);

            expect(result).toEqual({});
        });


        describe('size', () => {
            it('flags files larger than the size limit', async () => {
                host.size = 5;
                fixture.detectChanges();
                const file = prepared(makeTextFile('big.txt', 'too long'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileSize).toBe(true);
                expect(file.errors.fileSize).toBe(true);
            });

            it('does not flag files within the size limit', async () => {
                host.size = 100;
                fixture.detectChanges();
                const file = prepared(makeTextFile('ok.txt', 'ok'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileSize).toBeUndefined();
                expect(file.errors.fileSize).toBeUndefined();
            });
        });


        describe('allowedExt', () => {
            it('flags files whose name does not match a string pattern', async () => {
                host.allowedExt = '\\.txt';
                fixture.detectChanges();
                const file = prepared(makeTextFile('foo.jpg', '', 'image/jpeg'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileExt).toBe(true);
                expect(file.errors.fileExt).toBe(true);
            });

            it('passes files whose name matches a string pattern', async () => {
                host.allowedExt = '\\.txt';
                fixture.detectChanges();
                const file = prepared(makeTextFile('foo.txt'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileExt).toBeUndefined();
                expect(file.errors.fileExt).toBeUndefined();
            });

            it('passes files matching one entry of an array pattern', async () => {
                host.allowedExt = ['\\.txt', '\\.md'];
                fixture.detectChanges();
                const file = prepared(makeTextFile('note.md', '', 'text/markdown'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileExt).toBeUndefined();
            });

            it('passes files matching a RegExp pattern', async () => {
                host.allowedExt = /\.(txt|md)$/i;
                fixture.detectChanges();
                const file = prepared(makeTextFile('note.md', '', 'text/markdown'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileExt).toBeUndefined();
            });

            it('skips ext validation when allowedExt is not set', async () => {
                fixture.detectChanges();
                const file = prepared(makeTextFile('weird.qqq', '', 'application/octet-stream'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileExt).toBeUndefined();
            });
        });


        describe('allowedTypes', () => {
            it('flags files whose MIME type does not match a string pattern', async () => {
                host.allowedTypes = 'image';
                fixture.detectChanges();
                const file = prepared(makeTextFile('a.txt'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileType).toBe(true);
                expect(file.errors.fileType).toBe(true);
            });

            it('passes files whose MIME type matches', async () => {
                host.allowedTypes = 'text';
                fixture.detectChanges();
                const file = prepared(makeTextFile('a.txt'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileType).toBeUndefined();
                expect(file.errors.fileType).toBeUndefined();
            });

            it('passes files matching one entry of an array pattern', async () => {
                host.allowedTypes = ['text', 'image'];
                fixture.detectChanges();
                const file = prepared(makeTextFile('img.jpg', '', 'image/jpeg'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileType).toBeUndefined();
            });

            it('passes files matching a RegExp pattern', async () => {
                host.allowedTypes = /^image\//;
                fixture.detectChanges();
                const file = prepared(makeTextFile('img.jpg', '', 'image/jpeg'));
                host.control.setValue([file]);

                const result = await runValidate(accessor, host.control);

                expect(result.fileType).toBeUndefined();
            });
        });


        describe('image dimensions', () => {
            it('flags images wider than maxWidth and sets the imageWidth alias', async () => {
                host.withMeta = true;
                host.maxWidth = 5;
                fixture.detectChanges();
                const file = await makePngFile(10, 10);

                accessor.onChange([file]);
                await awaitLoad(file.imgLoadReplay);
                const result = await runValidate(accessor, host.control);

                expect(result.maxWidth).toBe(true);
                expect(result.imageWidth).toBe(true);
                expect(file.errors?.maxWidth).toBe(true);
                expect(file.errors?.imageWidth).toBe(true);
            });

            it('flags images taller than maxHeight and sets the imageHeight alias', async () => {
                host.withMeta = true;
                host.maxHeight = 5;
                fixture.detectChanges();
                const file = await makePngFile(5, 10);

                accessor.onChange([file]);
                await awaitLoad(file.imgLoadReplay);
                const result = await runValidate(accessor, host.control);

                expect(result.maxHeight).toBe(true);
                expect(result.imageHeight).toBe(true);
                expect(file.errors?.maxHeight).toBe(true);
                expect(file.errors?.imageHeight).toBe(true);
            });

            it('flags images narrower than minWidth and sets the imageWidth alias', async () => {
                host.withMeta = true;
                host.minWidth = 100;
                fixture.detectChanges();
                const file = await makePngFile(10, 10);

                accessor.onChange([file]);
                await awaitLoad(file.imgLoadReplay);
                const result = await runValidate(accessor, host.control);

                expect(result.minWidth).toBe(true);
                expect(result.imageWidth).toBe(true);
                expect(file.errors?.minWidth).toBe(true);
                expect(file.errors?.imageWidth).toBe(true);
            });

            it('flags images shorter than minHeight and sets the imageHeight alias', async () => {
                host.withMeta = true;
                host.minHeight = 100;
                fixture.detectChanges();
                const file = await makePngFile(10, 10);

                accessor.onChange([file]);
                await awaitLoad(file.imgLoadReplay);
                const result = await runValidate(accessor, host.control);

                expect(result.minHeight).toBe(true);
                expect(result.imageHeight).toBe(true);
                expect(file.errors?.minHeight).toBe(true);
                expect(file.errors?.imageHeight).toBe(true);
            });

            it('passes images that fall within all bounds', async () => {
                host.withMeta = true;
                host.minWidth = 1;
                host.minHeight = 1;
                host.maxWidth = 100;
                host.maxHeight = 100;
                fixture.detectChanges();
                const file = await makePngFile(10, 10);

                accessor.onChange([file]);
                await awaitLoad(file.imgLoadReplay);
                const result = await runValidate(accessor, host.control);

                expect(result.minWidth).toBeUndefined();
                expect(result.minHeight).toBeUndefined();
                expect(result.maxWidth).toBeUndefined();
                expect(result.maxHeight).toBeUndefined();
                expect(result.imageWidth).toBeUndefined();
                expect(result.imageHeight).toBeUndefined();
            });

            it('skips image dimension checks when withMeta is false', async () => {
                host.withMeta = false;
                host.maxWidth = 1;
                fixture.detectChanges();
                const file = await makePngFile(10, 10);

                accessor.onChange([file]);
                const result = await runValidate(accessor, host.control);

                expect(result.maxWidth).toBeUndefined();
                expect(result.imageWidth).toBeUndefined();
            });
        });


        it('aggregates errors across multiple files while marking only the offending files', async () => {
            host.size = 5;
            host.allowedExt = '\\.txt';
            fixture.detectChanges();
            const bigJpg = prepared(makeTextFile('big.jpg', 'too long', 'image/jpeg'));
            const smallTxt = prepared(makeTextFile('ok.txt', 'ok'));
            host.control.setValue([bigJpg, smallTxt]);

            const result = await runValidate(accessor, host.control);

            expect(result.fileSize).toBe(true);
            expect(result.fileExt).toBe(true);
            expect(bigJpg.errors.fileSize).toBe(true);
            expect(bigJpg.errors.fileExt).toBe(true);
            expect(smallTxt.errors.fileSize).toBeUndefined();
            expect(smallTxt.errors.fileExt).toBeUndefined();
        });
    });
});


function makeTextFile(name: string, content: string = '', type: string = 'text/plain'): ICustomFile {
    return new File([content], name, {type}) as ICustomFile;
}

function makePngFile(width: number, height: number): Promise<ICustomFile> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('2D canvas context unavailable'));
            return;
        }
        ctx.fillStyle = '#f00';
        ctx.fillRect(0, 0, width, height);
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('canvas.toBlob returned null'));
                return;
            }
            resolve(new File([blob], `pic-${width}x${height}.png`, {type: 'image/png'}) as ICustomFile);
        }, 'image/png');
    });
}

function prepared(file: ICustomFile): PreparedFile {
    return Object.assign(file, {errors: {}});
}

function awaitLoad(replay: Observable<unknown> | undefined): Promise<unknown> {
    if (replay == null) {
        throw new Error('expected the file to have a load replay subject');
    }
    return firstValueFrom(replay);
}

async function runValidate(accessor: FileInputAccessor, control: FormControl): Promise<ValidationErrors> {
    const out = accessor.validate(control);
    const errors = out instanceof Observable ? await firstValueFrom(out) : await out;
    return errors ?? {};
}
