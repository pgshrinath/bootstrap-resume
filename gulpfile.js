const { src, dest, series, watch, parallel } = require('gulp')
const del = require('del')
const beautify = require('gulp-beautify')
const webServer = require('gulp-webserver')
const sass = require('gulp-sass')(require('sass'))

function cleandocs() {
  return del(['docs'])
}

function copyStaticTodocs() {
  return src(['src/static/**/*.*']).pipe(dest('docs' + '/static/'))
}

function copyHtmlTodocs() {
  return src(['src/*.html'])
    .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
    .pipe(dest('docs'))
}

function copyJsTodocs() {
  return src(['src/js/**/*.js']).pipe(dest('docs' + '/js/'))
}

function copyScssTodocs() {
  return src(['src/scss/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('docs' + '/css/'))
}

function watchFiles() {
  watch('src/js/**/*', copyJsTodocs)
  watch('src/scss/**/*', copyScssTodocs)
  watch('src/*', copyHtmlTodocs)
}

function webServerStart() {
  return src('docs').pipe(
    webServer({
      port: 8000,
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: './docs/index.html',
    }),
  )
}

exports.build = series(cleandocs, copyHtmlTodocs, copyStaticTodocs)
exports.default = series(
  copyStaticTodocs,
  copyHtmlTodocs,
  copyJsTodocs,
  copyScssTodocs,
  parallel(watchFiles, webServerStart),
)
