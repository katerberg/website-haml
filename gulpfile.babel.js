// Gulp dependencies
import gulp from 'gulp';
import haml from 'gulp-haml';
import minifyHTML from 'gulp-htmlmin';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';

const basedir = './src';
const targetdir = './dist';

// Handle haml and minification of HTML
gulp.task('html', () => {
  gulp.src(`${basedir}/haml/**/*.haml`)
    .pipe(haml())
    .pipe(minifyHTML({
        "collapseWhitespace": true
    }))
    .pipe(gulp.dest(`${targetdir}`));
});

// Compile Our Sass
gulp.task('sass', () => {
    return gulp.src(`${basedir}/scss/**/*.scss`)
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest(`${targetdir}/css`));
});

// Watch Files For Changes
gulp.task('watch', () => {
    gulp.watch(`${basedir}/**/*.haml`, ['html']);
    gulp.watch(`${basedir}/**/*.scss`, ['sass']);
});

// Build task
gulp.task('build', ['html', 'sass']);

// Default Task
gulp.task('default', ['build', 'watch']);
