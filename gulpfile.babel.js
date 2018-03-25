// Gulp dependencies
import gulp from 'gulp';
import haml from 'gulp-haml';
import minifyHTML from 'gulp-htmlmin';

const basedir = './';

// Handle haml and minification of HTML
gulp.task('html', () => {
  gulp.src('./haml/**/*.haml')
    .pipe(haml())
    .pipe(minifyHTML({
        "collapseWhitespace": true
    }))
    .pipe(gulp.dest('./dist/html'));
});

// Watch Files For Changes
gulp.task('watch', () => {
    gulp.watch(`${basedir}**/*.haml`, ['html']);
});

// Build task
gulp.task('build', ['html']);

// Default Task
gulp.task('default', ['build', 'watch']);
