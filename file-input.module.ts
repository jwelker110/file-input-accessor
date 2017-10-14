import {NgModule} from "@angular/core";
import {FileInputDirective} from "./file-input.directive";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@NgModule({
    declarations: [FileInputDirective],
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [FileInputDirective]
})
export class FileInputModule {
}
