var gulp = require('gulp');
var haml = require('gulp-haml');
 
gulp.task('html', function () {
  gulp.src('./haml/index.haml')
    .pipe(haml())
    .pipe(gulp.dest('./dist/html'));
});
