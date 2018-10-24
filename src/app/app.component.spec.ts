import {async, TestBed} from '@angular/core/testing';
import {FileInputAccessorModule} from '../../projects/file-input-accessor/src/lib/file-input-accessor.module';
import {AppComponent} from './app.component';
import {FileFormComponent} from './components/file-form/file-form.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                FileFormComponent
            ],
            imports: [
                FileInputAccessorModule
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    it(`should have as title 'FileInputAccessorDemo'`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('FileInputAccessorDemo');
    }));
});
