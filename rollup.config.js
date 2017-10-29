export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/fileinputaccessor.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.fileinputaccessor',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/forms': 'ng.forms',
    'rxjs/Observable': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/observable/fromEvent': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable',
    'rxjs/add/observable/empty': 'Rx.Observable',
    'rxjs/add/observable/forkJoin': 'Rx.Observable',
    'rxjs/add/observable/fromPromise': 'Rx.Observable',
    'rxjs/add/observable/interval': 'Rx.Observable',
    'rxjs/add/observable/take': 'Rx.Observable',
  }
}
