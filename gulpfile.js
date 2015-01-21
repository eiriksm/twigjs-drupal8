'use strict';
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var livereload = require('gulp-livereload');

gulp.task('scripts', function() {
  browserify('./js/main.js', {
      debug: true,
      transform: 'brfs'
    })
    .bundle()
    .pipe(source('js.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('build/**').on('change', livereload.changed);
  gulp.watch(['js/**/*', 'templates/*.*'], ['scripts']);
});
