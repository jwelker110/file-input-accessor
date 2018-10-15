import {async, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileInputAccessorStubComponent} from '../testing/file-input-accessor-stub';
import {FileInputAccessor} from './file-input-accessor';


describe('FileInputAccessor', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                FileInputAccessor,
                FileInputAccessorStubComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule
            ]
        }).compileComponents();
    }));


    it(`Should attach to input where type=file`, async(() => {
        const fixture = TestBed.createComponent(FileInputAccessorStubComponent);
        const comp: FileInputAccessorStubComponent = fixture.debugElement.componentInstance;
        expect(comp.accessor).toBeTruthy();
    }));

    it(`Should`)
    
});
