// Gulp dependencies
import gulp from 'gulp';
import haml from 'gulp-haml';
import minifyHTML from 'gulp-htmlmin';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import babel from 'gulp-babel';

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

// Concatenate & Minify JS
gulp.task('scripts', () => {
    return gulp.src([`${basedir}/js/**/*.js`])
        .pipe(concat('app.js'))
        .pipe(babel())
        .pipe(gulp.dest(`${targetdir}/js`))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(`${targetdir}/js`));
});

// Deploy dependency JS
gulp.task('dependantJs', () => gulp.src(['node_modules/suncalc/suncalc.js', 'node_modules/moment/min/moment.min.js'])
    .pipe(gulp.dest(`${targetdir}/js`)));

// Watch Files For Changes
gulp.task('watch', () => {
    gulp.watch(`${basedir}/**/*.haml`, ['html']);
    gulp.watch(`${basedir}/**/*.scss`, ['sass']);
    gulp.watch(`${basedir}/**/*.js`, ['scripts']);
});

// Build task
gulp.task('build', ['html', 'sass', 'scripts', 'dependantJs']);

// Default Task
gulp.task('default', ['build', 'watch']);
