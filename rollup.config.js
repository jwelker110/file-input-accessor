export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundles/fileinput.umd.js',
    format: 'umd'
  },
  sourceMap: false,
  name: 'ng.file-input-directive',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/forms': 'ng.forms'
  }
}
