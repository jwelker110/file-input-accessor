export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/fileinputaccessor.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'ng.fileinputaccessor',
    globals: {
        '@angular/core': 'ng.core',
        '@angular/forms': 'ng.forms',
        'rxjs': 'Rx',
        'rxjs/operators': 'Rx.Operators'
    }
}
