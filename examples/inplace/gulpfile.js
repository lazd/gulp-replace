var gulp = require('gulp');
var replace = require('../../');

gulp.task('replace', function() {
  return gulp.src('files/myFile.txt', { base : './' } )
    .pipe(replace('roof', 'world'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['replace']);
