var gulp = require('gulp');
/** REMOVE ME **/ var replace = require('../../');
/** USE ME **/ // var replace = require('gulp-replace');

gulp.task('replace', function() {
  // Do an in-place replace on file.txt
  return gulp.src('file.txt', { base : './' } )
    .pipe(replace('roof', 'world'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['replace']);
