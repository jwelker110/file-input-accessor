# Unreleased
* Modernized `FileInputAccessor` internals to current Angular idioms: signal `input()`s, `inject()`, and `host` metadata instead of decorators.
* Template bindings, validation behavior, and error keys are unchanged.
* **Breaking (narrow case)**: reading the directive's inputs programmatically (e.g. `accessor.allowedExt`) now returns a signal function instead of a plain value. Call it (`accessor.allowedExt()`) to get the value. The `allowedExt` value is also no longer mutated on assignment - end-of-name anchoring (`$`) is applied when the pattern is evaluated, so reading the input back returns exactly what was set.
* `registerOnTouched` now stores its callback, so the control is properly marked touched on blur.
* `validate` initializes a missing `errors` object on each file instead of throwing when a file set programmatically fails a check.
* Library unit tests run on vitest (browser mode via Playwright) instead of Karma.
* Linting migrated from tslint/codelyzer to ESLint with `angular-eslint`.
* Removed the Protractor e2e project and its dependencies.
* Removed the demo app's unused Karma test setup.
* Added package-level tests: the demo app's vitest suite consumes the built package from `dist/` through the real file input. `npm test` runs the library suite and then the demo suite.

# 21.0.0 (2025-12-25)
* Update the Angular dependencies to latest version.
* Updated README - updated links and removed file upload example.

# 20.0.0 (2025-06-16)
* Update the Angular dependencies to latest version.
* Minor README cleanup.

# 19.0.0 (2025-01-24)
* Update the Angular dependencies to latest version.

# 18.0.0 (2024-09-19)
* Update the Angular dependencies to latest version.

# 17.0.0 (2024-01-12)
* Update the Angular dependencies to latest version.

# 16.0.0 (2023-07-26)
* Update the Angular dependencies to latest version.

# 15.0.0 (2022-12-29)
* Update the Angular dependencies to latest version.

# 14.0.0 (2022-08-01)
* Update the Angular dependencies to latest version.
* Use UntypedFormControl.

# 9.0.1 (2020-03-19)
* Update the Angular dependencies to latest version.

# 9.0.0 (2020-02-22)
* Updated to Angular 9.

# 8.1.1 (2019-09-02)
* Fix a bug where min validation was not performed if max constraints were not set.

# 8.1.0 (2019-09-02)
* Add minHeight and minWidth validation for images. Closing [#4](https://github.com/jwelker110/file-input-accessor/issues/4).
* Add maxHeight, maxWidth, minHeight, and minWidth properties to errors object.
* imageWidth and imageHeight properties now reflect validation errors for their counterparts (maxWidth, minWidth for imageWidth, maxHeight, minHeight for imageHeight)

# 8.0.0 (2019-05-29)
* Update to Angular v8.

# 7.0.0 (2018-10-23)
* Update to Angular v7. Major versions will align with major Angular versions moving forward.
* Compatible with Angular SSR (Server Side Rendering) since version 2.0.1.
* Packaging updated to use [ng-packagr](https://www.npmjs.com/package/ng-packagr), according to instructions provided [here](https://blog.angularindepth.com/creating-a-library-in-angular-6-87799552e7e5).

# 2.0.1 (2018-10-15)
* Validation when using string or array doesn't match against file extension correctly. 
This matches against the end of the filenames by appending `$` to the end of the string or 
string array Regex.

# 2.0.0 (2018-05-05)
* Updated demo and README - Added compatibility section and links 
to [Rxjs](https://beta-rxjsdocs.firebaseapp.com/) docs.

### Breaking Changes
* Using Angular v6, which means Rxjs v6, which means if your project
is using Angular v4 or v5, you should stick to FileInputAccessor v1.x.x

# 1.0.12 (2018-05-05)
* README.md - Added example code for uploading files
* Dependencies - Updated so they actually reflect the Angular versions this is compatible with. Version 1.x.x works with Angular >=4.0.0 <6.0.0
* Removed some redundant code that wasn't really doing anything (fingers crossed).

# 1.0.11 (2018-02-16)
* Fix an [error](https://github.com/angular/angular/issues/20095) when 
importing directly from Rxjs.
* **This will [change](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md#breaking-changes-1)
in future versions (version 2.x) to keep best practices moving forward**

# 1.0.10 (2018-02-16)
* Update types from 'any'.
* Add [setDisabledState()]() implementation.
* Demo cleanup.
* Refactor input properties to provide better completion.

# 1.0.9 (2018-01-26)
* Update RxJS to [5.5.6](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md#556-2017-12-21) and 
removed deep operator imports in favor of [pipeable](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) operators.
