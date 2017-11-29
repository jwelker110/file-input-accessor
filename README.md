# FileInputAccessor

Angular (4+) file input accessor that can be used with 
Reactive or Template-driven forms. Check out the 
[demo](https://jwelker110.github.io/file-input-accessor/).

#### Installation

1. Install package from npm
```
npm i file-input-accessor
```

2. Include FileInputAccessor into your application
```typescript
import {BrowserModule} from '@angular/platform-browser';
import {FileInputAccessorModule} from "file-input-accessor";

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FileInputAccessorModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

```

#### Usage

This can be used with reactive or template-driven forms.

```angular2html
<!--Reactive Forms-->
<input type="file" multiple [formControl]="someFileControl" />
<input type="file" multiple formControlName="someFileControl" />

<!--Template-driven-->
<input type="file" name="file-input" multiple [(ngModel)]="fileList" />
```

#### Validation

An async validator is included and only runs if sync validation passes and values 
are provided to the accessor inputs. The following errors may be set `true` on 
the control if at least one file fails validation:

* fileSize - File size is too large.
* fileType - File **type** failed to match.
* fileExt - File **extension** failed to match.
* imageWidth - Image is too wide (Requires `withMeta` set to `true`).
* imageHeight - Image is too tall (Requires `withMeta` set to `true`).

#### Accessor Inputs

All inputs are optional.

* `[allowedExt]` - Used to validate each file's **extension**. Accepts the following:
    - A [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) instance.
    - A String that will be used to create a new RegExp.
    - An array of strings that will be joined into a single capture group and used to create a new RegExp.
* `[allowedTypes]` - Accepts the same as allowedExt but will be used to validate the file's **type**.
* `[size]` - Used to verify each file's size does not exceed the provided value.
* `[withMeta]` - If `true`, each file will receive additional properties 
adhering to the ICustomFile interface. Required `true` to allow validating
maxHeight and maxWidth.
* `[maxHeight]` - The largest acceptable height, in pixels, for image files.
* `[maxWidth]` - The largest acceptable width, in pixels, for image files.

#### ICustomFile

An interface implemented by the Files added to the control. All properties are 
optional and only present if `withMeta` input is set to `true`.

* If the file's **type** is image:
    - `imgSrc` - Contains a data: URL representing the file data.
    - `imgHeight` - The height of the image, in pixels.
    - `imgWidth` - The width of the image, in pixels.
    - `isImg` - `true`.
* If the file's **type** is text:
    - `textContent` - The text content of the file.
* Each file contains an `errors` property that contains an errors
object. The following errors will be set `true` if the file has 
failed that validation check.
    - fileSize - File size is too large.
    - fileType - File **type** failed to match.
    - fileExt - File **extension** failed to match.
    - imageWidth - Image is too wide.
    - imageHeight - Image is too tall.


