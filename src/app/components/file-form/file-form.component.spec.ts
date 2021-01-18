import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {FileInputAccessorModule} from '../../../../projects/file-input-accessor/src/lib/file-input-accessor.module';

import {FileFormComponent} from './file-form.component';

describe('FileFormComponent', () => {
    let component: FileFormComponent;
    let fixture: ComponentFixture<FileFormComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FileFormComponent],
            imports: [FileInputAccessorModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FileFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
