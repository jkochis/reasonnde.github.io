const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer')
const babel = require('gulp-babel');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const browserSync = require('browser-sync');
const neat = require('node-neat');
const buffer = require('vinyl-buffer')
const source = require('vinyl-source-stream');
const reload = browserSync.reload;

/* Scripts task */
gulp.task('scripts', function () {
     browserify('./js/main.js')
        .bundle()
         .on('error', function (error) {
             console.error('' + error);
         })
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('js'));
})
;

/* Sass task */
gulp.task('sass', function () {
    gulp.src('scss/styles.scss')
        .pipe(plumber())
        .pipe(sass({
            includePaths: ['scss'].concat(neat)
        }))
        .pipe(gulp.dest('css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(cleancss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'))
        /* Reload the browser CSS after every change */
        .pipe(reload({stream: true}));
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function () {
    browserSync.init(['css/*.css', 'js/*.js'], {
        server: {
            baseDir: './'
        }
    });
});

/* Convert SVGs */
// gulp.task('svg2png', function () {
//     gulp.src('images/**/*.svg')
//         .pipe(svg2png())
//         .pipe(gulp.dest('images'));
// });

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['sass', 'browser-sync'], function () {
    gulp.watch(['scss/*.scss', 'scss/**/*.scss'], ['sass'])
    gulp.watch(['js/main.js'], ['scripts'])
    gulp.watch(['*.html'], ['bs-reload']);
});