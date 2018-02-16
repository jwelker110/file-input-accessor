export default {
    input: 'dist/index.js',
    output: {
        file: 'dist/bundles/fileinputaccessor.umd.js',
        format: 'umd'
    },
    sourceMap: false,
    name: 'ng.fileinputaccessor',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/forms': 'ng.forms',
        'rxjs': 'Rx',
        'rxjs/operators': 'Rx.Operators',
        'rxjs/Observable': 'Rx.Observable',
        'rxjs/ReplaySubject': 'Rx.ReplaySubject',
        'rxjs/observable/forkJoin': 'Rx.Observable.forkJoin',
        'rxjs/observable/fromEvent': 'Rx.Observable.fromEvent',
        'rxjs/observable/of': 'Rx.Observable.of'
    }
}
