export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundles/fileinput.umd.js',
    format: 'umd'
  },
  sourceMap: false,
  name: 'ng-fileinput',
  globals: {
    'rxjs/Observable': 'Observable',
    'rxjs/ReplaySubject': 'ReplaySubject',
    '@angular/core': 'ng.core',
    '@angular/forms': 'ng.forms'
  },
  external: [
    'rxjs/Observable',
    'rxjs/ReplaySubject',
    'rxjs/add/observable/empty',
    'rxjs/add/observable/forkJoin',
    'rxjs/add/observable/fromEvent',
    'rxjs/add/observable/fromPromise',
    'rxjs/add/observable/interval',
    'rxjs/add/observable/of',
    'rxjs/add/operator/map',
    'rxjs/add/operator/mergeMap',
    'rxjs/add/operator/take',
    '@angular/core',
    '@angular/forms'
  ],
}
