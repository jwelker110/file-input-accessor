import {beforeEach, describe, expect, it} from 'vitest';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FileInputAccessor} from 'file-input-accessor';
import {makePngFile, makeTextFile, selectFiles, settled} from '@testing/file-helpers';

import {FileFormComponent} from './file-form.component';

// `file-input-accessor` resolves to dist/ (see tsconfig.json paths), so these tests run against
// the packaged library the way an npm consumer would, not against the source.
describe('FileFormComponent (consuming the built package)', () => {
    let fixture: ComponentFixture<FileFormComponent>;
    let component: FileFormComponent;
    let inputEl: HTMLInputElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileFormComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(FileFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        inputEl = fixture.debugElement.query(By.css('input[type=file]')).nativeElement;
    });

    it('attaches the packaged directive to the file input', () => {
        const directive = fixture.debugElement.query(By.directive(FileInputAccessor));

        expect(directive).toBeTruthy();
        expect(directive.nativeElement).toBe(inputEl);
    });

    it('lists a selected file after the input fires change', () => {
        selectFiles(inputEl, [makeTextFile('hello.txt', 'hi')]);
        fixture.detectChanges();

        expect(component.fileList.length).toBe(1);
        expect(component.fileList[0].name).toBe('hello.txt');
        expect(component.fileList[0].errors).toEqual({});
        expect(fixture.nativeElement.textContent).toContain('hello.txt');
    });

    it('flags a file that exceeds the size limit and highlights the form-level error line', () => {
        component.size = 5;
        fixture.detectChanges();

        selectFiles(inputEl, [makeTextFile('big.txt', 'too long')]);
        fixture.detectChanges();

        expect(component.fileControl.invalid).toBe(true);
        expect(component.fileControl.errors?.fileSize).toBe(true);
        expect(formErrorLine('File size exceeds maximum.').classList).toContain('text-danger');
    });

    it('stays pending while image metadata loads, then flags images below the minimum bounds', async () => {
        component.allowedFileTypes = 'image';
        component.allowedFileExt = '\\.png';
        fixture.detectChanges();
        const png = await makePngFile(10, 10);

        selectFiles(inputEl, [png]);

        expect(component.form.pending).toBe(true);
        await settled(component.fileControl);
        fixture.detectChanges();

        expect(component.fileControl.errors?.minWidth).toBe(true);
        expect(component.fileControl.errors?.minHeight).toBe(true);
        expect(component.fileList[0].errors?.minWidth).toBe(true);
        expect(formErrorLine('Image not wide enough.').classList).toContain('text-danger');
    });

    function formErrorLine(text: string): HTMLElement {
        const lines: HTMLElement[] = Array.from(fixture.nativeElement.querySelectorAll('.col-6.error-container div'));
        const line = lines.find((el) => el.textContent?.trim() === text);
        if (line == null) {
            throw new Error(`form-level error line "${text}" not found`);
        }
        return line;
    }
});
