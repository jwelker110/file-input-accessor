import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ICustomFile} from "../../../../src/interfaces";

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

    form: FormGroup;

    checkbox: FormControl;

    constructor(private _fb: FormBuilder) {
        this.form = _fb.group({
            file: ['']
        });
    }

    ngOnInit() {
        this.checkbox = new FormControl(this.withMeta);
        this.form.get('file').valueChanges
            .subscribe((val) => {
                console.log('%c-----FILE LIST CHANGED-----', 'background-color: #008351; color: #fff');
                console.log(val);
                this.fileList = val ? val : [];
            });

        this.checkbox.valueChanges
            .subscribe((val) => {
                this.removeFiles();
                this.withMeta = val;
            })

    }

    removeFiles() {
        this.form.get('file').setValue('');
    }

    updateSize(size: number) {
        this.size = size;
    }

    updateTypes(typeRegEx: string) {
        this.allowedFileTypes = typeRegEx;
        this.allowedFileExt = null;
    }

    updateExt(extRegEx: string) {
        this.allowedFileExt = extRegEx;
        this.allowedFileTypes = null;
    }

    updateDimensions(width: number, height: number) {
        this.maxWidth = width ? width : null;
        this.maxHeight = height ? height : null;
    }

    updateValues(size, width, height, typeRegEx, extRegEx) {
        this.updateSize(size);
        this.updateDimensions(width, height);
        this.updateTypes(typeRegEx);
        this.updateExt(extRegEx);
        this.removeFiles();
    }
}


