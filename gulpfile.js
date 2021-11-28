const { src, dest, series, watch, parallel } = require('gulp')
const del = require('del')
const beautify = require('gulp-beautify')
const webServer = require('gulp-webserver')
const sass = require('gulp-sass')(require('sass'))

function cleandoc() {
  return del(['doc'])
}

function copyStaticTodoc() {
  return src(['src/static/**/*.*']).pipe(dest('doc' + '/static/'))
}

function copyHtmlTodoc() {
  return src(['src/*.html'])
    .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
    .pipe(dest('doc'))
}

function copyJsTodoc() {
  return src(['src/js/**/*.js']).pipe(dest('doc' + '/js/'))
}

function copyScssTodoc() {
  return src(['src/scss/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('doc' + '/css/'))
}

function watchFiles() {
  watch('src/js/**/*', copyJsTodoc)
  watch('src/scss/**/*', copyScssTodoc)
  watch('src/*', copyHtmlTodoc)
}

function webServerStart() {
  return src('doc').pipe(
    webServer({
      port: 8000,
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: './doc/index.html',
    }),
  )
}

exports.build = series(cleandoc, copyHtmlTodoc, copyStaticTodoc)
exports.default = series(
  copyStaticTodoc,
  copyHtmlTodoc,
  copyJsTodoc,
  copyScssTodoc,
  parallel(watchFiles, webServerStart),
)
