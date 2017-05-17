var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var reload = browserSync.reload;

var src = {
    scss: 'app/scss/**/*.scss',
    css: 'app/css',
    js: 'app/js/*.js',
    html: 'app/*.html'
};

// Static Server + watching scss/html files
// https://github.com/BrowserSync/browser-sync/issues/699
// https://www.browsersync.io/docs/options#option-server
gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: {
            baseDir: "app",
            routes: {
                "/bower_components": "bower_components"
            }
        },
        // https://browsersync.io/docs/options#option-port
        port: 8080
    });

    gulp.watch(src.scss, ['sass']);
    gulp.watch(src.js).on('change', reload);
    gulp.watch(src.html).on('change', reload);
});

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp
        .src(src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(src.css))
        .pipe(reload({ stream: true }));
});

gulp.task('default', ['serve']);
