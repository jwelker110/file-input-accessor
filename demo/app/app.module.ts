import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FileFormComponent} from "./components/file-form/file-form.component";
import {FileInputAccessorModule} from "file-input-accessor";

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
