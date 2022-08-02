import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ICustomFile} from 'file-input-accessor';

@Component({
    selector: 'app-file-form',
    templateUrl: './file-form.component.html',
    styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit {

    fileList: ICustomFile[] = [];

    allowedFileTypes = '(text|jpe?g)';
    allowedFileExt = '(.txt|.jpe?g)';
    withMeta = true;
    size = 50000;
    maxWidth = 480;
    maxHeight = 360;
    minWidth = 400;
    minHeight = 300;

    form: UntypedFormGroup;
    fileControl: UntypedFormControl;

    checkbox: UntypedFormControl;

    constructor(private _fb: UntypedFormBuilder) {
        this.form = _fb.group({
            file: ['']
        });
        this.fileControl = <UntypedFormControl> this.form.get('file');
    }

    ngOnInit() {
        this.checkbox = new UntypedFormControl(this.withMeta);
        this.fileControl.valueChanges
            .subscribe((val) => {
                console.log('%c-----FILE LIST CHANGED-----', 'background-color: #008351; color: #fff');
                console.log(val);
                this.fileList = val ? val : [];
            });

        this.checkbox.valueChanges
            .subscribe((val) => {
                this.removeFiles();
                this.withMeta = val;
            });

    }

    removeFiles() {
        this.fileControl.setValue([]);
    }

    disableFileControl() {
        this.fileControl.disable();
    }

    enableFileControl() {
        this.fileControl.enable();
    }

    updateSize(size: number) {
        this.size = size;
    }

    updateTypes(typeRegEx: string) {
        this.allowedFileTypes = typeRegEx;
    }

    updateExt(extRegEx: string) {
        this.allowedFileExt = extRegEx;
    }

    updateDimensions(maxWidth: number, maxHeight: number, minWidth: number, minHeight: number) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.minWidth = minWidth;
        this.minHeight = minHeight;
    }

    updateValues(size, maxWidth, maxHeight, minWidth, minHeight, typeRegEx, extRegEx) {
        this.updateSize(size);
        this.updateDimensions(maxWidth, maxHeight, minWidth, minHeight);
        this.updateTypes(typeRegEx);
        this.updateExt(extRegEx);
        this.removeFiles();
    }
}


