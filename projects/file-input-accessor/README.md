Looking for the [changelog](https://github.com/jwelker110/file-input-accessor/blob/master/CHANGELOG.md)?

#### (Versions of this package < 2.0.1) If you see an error about an unknown token `{` with some imports.

This isn't compatible with Angular Universal (Server side rendering) yet. I'll fix this in a future release. Until then, if you need to server-side render this package, please refer to the instructions [here](https://github.com/SebastianM/angular-google-maps/issues/1052#issuecomment-331150772). Summarized below:

- npm i --save-dev babel-cli babel-preset-es2015
- create a .babelrc file in the project's root directory with the following contents:
    ```json 
    {
        "presets": ["es2015"]
    }
    ```
- Add a script to your package.json:
    ```json
    "compile:file-input-accessor": "babel node_modules/file-input-accessor -d node_modules/file-input-accessor --presets es2015"
    ```
- Add a postinstall script to your package.json scripts section:
    ```json
    "postinstall": "compile:file-input-accessor"
    ```

# FileInputAccessor

Adds Reactive and Template behavior you're used to using with Angular Forms, but for `<input type="file">`. Check out the [demo](https://jwelker110.github.io/file-input-accessor/) to see it in action. 

Sample code for sending the files from Angular to your backend is [further down](#uploading-the-files) this page. 

Provides [NG_VALUE_ACCESSOR](https://angular.io/api/forms/NG_VALUE_ACCESSOR) implementing the [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor)
interface. For more info, refer to [this stack overflow answer](https://stackoverflow.com/questions/41889384/angular2-validation-for-input-type-file-wont-trigger-when-changing-the-fi/41938495#41938495)
linked on [this issue](https://github.com/angular/angular/issues/7341).

- [Which version should I use?](#which-version-should-i-use)
- [Installation](#installation)
- [Using in your form](#using-in-your-form)
- [Validation](#validation)
- [Accessor Inputs](#accessor-inputs)
- [ICustomFile](#icustomfile)

## Which version should I use?

**Version 1.x.x uses [Rxjs](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md) v5.5.x.** Rxjs v6 underwent some changes that include adjustments to the way operators are imported along with other [breaking changes](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md#600-alpha1-2018-01-12). 

**Version 2.x.x uses Rxjs v6.** If you're interested in updating your projects, [a package](https://www.npmjs.com/package/rxjs-compat) has been created for that very purpose by the Rxjs team.

As a general rule:

- For Angular 4 and 5, use version 1.x.x.
- For Angular 6 use version 2.x.x.
- Angular 7 and above aligns with the Angular version, so for Angular 7, use 7.x.x, Angular 8, use 8.x.x, etc..

#### RxJS

RxJS [docs](https://beta-rxjsdocs.firebaseapp.com/) (beta as of 2018/05/05). [Another](https://www.learnrxjs.io/operators/) very helpful resource to familiarize yourself with Rxjs by providing a list of commonly used operators with examples.

## Using with your forms

1. Install package from npm 
   
   ```npm i file-input-accessor```

2. Import the FileInputAccessorModule.
    
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

3. That's it. You can use FormControl and NgModel with your file input.

   ```angular2html
    <!--file-upload.component.html-->

    <form>
      <!--Reactive form control-->
      <input type="file" multiple [formControl]="fileControl">
    </form>

    <form>
      <!--Template form control, using model changes to trigger upload-->
      <input type="file" multiple name="templateFileUploadControl" [ngModel]="modelChangesFiles" (ngModelChange)="onFileInputChange($event)">
    </form>

    <form>
      <!--Template form control, upload is manually triggered-->
      <input type="file" multiple [(ngModel)]="manualChangesFiles" name="templateFileUploadControl2">
      <button type="button" (click)="submitFiles()">Click to upload</button>
    </form>
   ```

## Uploading the files
1. Import the [HttpClientModule](https://angular.io/api/common/http/HttpClientModule) if it isn't already.

   ```typescript
    @NgModule({
        declarations: [
            AppComponent,
            FileUploadComponent
        ],
        imports: [
            BrowserModule,
            RouterModule.forRoot(ROUTES),
            HttpClientModule,
            FileInputAccessorModule
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
    export class AppModule {
    }
   ```

2. When you're ready to upload your files, append them to your [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) and use [HttpClient](https://angular.io/api/common/http/HttpClient) to call your file upload endpoint.

   ```typescript
    @Component({
        selector: 'app-file-upload',
        templateUrl: './file-upload.component.html',
        styleUrls: ['./file-upload.component.css']
    })
    export class FileUploadComponent implements OnInit {

        fileControl = new FormControl();

        modelChangesFiles: ICustomFile[] = [];
        manualChangesFiles: ICustomFile[] = [];

        constructor(private _http: HttpClient) {
        }

        /**
         * Subscribe to the valueChanges Observable on the reactive FormControl.
         */
        ngOnInit() {
            this.fileControl.valueChanges
                .pipe(mergeMap(files => this.uploadFiles(files)))
                .subscribe(() => this.fileControl.setValue([]));
        }

        /**
         * (ngModelChange) event handler
         *
         * @param {ICustomFile[]} event
         */
        onFileInputChange(event: ICustomFile[]) {
            this.uploadFiles(event)
                .subscribe(() => (this.modelChangesFiles = []));
        }

        /**
         * Upload button's (click) event handler
         */
        submitFiles() {
            this.uploadFiles(this.manualChangesFiles)
                .subscribe(() => (this.manualChangesFiles = []));
        }

        /**
         * Appends the provided files to FormData and returns an Observable that will pass the FormData
         * to the api when subscribed.
         *
         * @param {ICustomFile[]} files
         * @returns {Observable<Object>}
         */
        private uploadFiles(files: ICustomFile[]): Observable<Object> {
            if (!files || files.length === 0) {
                return EMPTY;
            }

            const data = new FormData();

            for (const file of files) {
                data.append('file', file.slice(), file.name);
            }
            return this._http.post('/api/files', data);
        }
    }
   ```

## Validation
An async validator is included and only runs if sync validation passes and values are provided to the accessor inputs. The following errors may be set `true` on the control if at least one file fails validation:

* fileSize - File size is too large.
* fileType - File **type** failed to match.
* fileExt - File **extension** failed to match.
* The image validation requires `withMeta` set to `true`.
    * imageWidth - Image does not meet width requirement.
    * imageHeight - Image does not meet height requirement.
    * (>= 8.1.0) maxHeight - Image is too tall.
    * (>= 8.1.0) maxWidth - Image is too wide.
    * (>= 8.1.0) minHeight - Image is not tall enough.
    * (>= 8.1.0) minWidth - Image is not wide enough

## Accessor Inputs

All inputs are optional.

* `[allowedExt]` - Used to validate each file's **extension**. Accepts the following:
    - A [RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) instance.
    - A String that will be used to create a new RegExp.
    - An array of strings that will be joined into a single capture group and used to create a new RegExp.
* `[allowedTypes]` - Accepts the same as allowedExt but will be used to validate the file's **type**.
* `[size]` - Used to verify each file's size (bytes) is <= the provided value.
* `[withMeta]` - If `true`, each file will receive additional properties adhering to the ICustomFile interface. If you plan to validate maxHeight and maxWidth, `true` **is required**.
* `[maxHeight]` - The largest acceptable height, in pixels, for image files.
* `[maxWidth]` - The largest acceptable width, in pixels, for image files.
* `[minHeight]` - The smallest acceptable height, in pixels, for image files.
* `[minWidth]` - The smallest acceptable width, in pixels, for image files.

## ICustomFile

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
    - imageWidth - Image does not meet width requirement.
    - imageHeight - Image does not meet height requirement.
    - (>= 8.1.0) maxHeight - Image is too tall.
    - (>= 8.1.0) maxWidth - Image is too wide.
    - (>= 8.1.0) minHeight - Image is not tall enough.
    - (>= 8.1.0) minWidth - Image is not wide enough.


