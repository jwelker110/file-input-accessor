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
