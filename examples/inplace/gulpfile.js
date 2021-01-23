var gulp = require('gulp');
/** REMOVE ME **/ var replace = require('../../');
/** USE ME **/ // var replace = require('gulp-replace');

function replaceText() {
  // Do an in-place replace on file.txt
  return gulp.src('file.txt', { base : './' } )
    .pipe(replace('roof', 'world'))
    .pipe(gulp.dest('./'));
}

module.exports.default = replaceText;
