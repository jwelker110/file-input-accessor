import {NgModule} from "@angular/core";
import {FileInputAccessor} from "./file-input-accessor";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
    declarations: [FileInputAccessor],
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [FileInputAccessor]
})
export class FileInputAccessorModule {
}
