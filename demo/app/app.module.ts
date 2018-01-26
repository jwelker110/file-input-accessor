import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FileInputAccessorModule} from 'file-input-accessor';

import {AppComponent} from './app.component';
import {FileFormComponent} from './components/file-form/file-form.component';

@NgModule({
    declarations: [
        AppComponent,
        FileFormComponent
    ],
    imports: [
        BrowserModule,
        FileInputAccessorModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
