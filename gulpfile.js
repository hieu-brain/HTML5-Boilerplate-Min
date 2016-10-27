var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-ruby-sass');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('server', function () {
    browserSync.init({
        online: true,
        open: 'external',
        injectChanges: true,
        startPath: "/",
        browser: 'google chrome',//['firefox'],
        server: {
            baseDir: "./dist/",    // Direction
            index: "index.html"      // HTML Run Page
        },
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: false
        }
    });
});

//Styles Task
//Sass
gulp.task('styles', function() {
    return sass('src/parts/scss/site.scss', { style: 'expanded' })
        .pipe(autoprefixer({
            browsers: ["last 2 versions", "Android >= 4.2", "ios >= 8", "ie >= 9"]
        }))
        .pipe(gulp.dest('dist/parts/css'))
        .pipe(gulp.dest('src/parts/css'))
        .pipe(browserSync.stream());
});

//HTML
gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Reload Browser
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Reload Browser
gulp.task('bs-stream', function () {
    browserSync.stream();
});

gulp.task('scripts', function() {
    return gulp.src('src/parts/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/parts/js'));
});

//Watches task
gulp.task('watch', function(){
    // Watch .scss files
    gulp.watch('src/parts/scss/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/parts/js/**/*.js', ['scripts']);

    // Watch html files
    gulp.watch('src/*.html', ['html','bs-reload']);
});

// Run
gulp.task('default', ['watch', 'server', 'styles', 'html', 'scripts'], function () {
    gulp.watch("./dist/*.html", ['bs-reload']);
    gulp.watch("./dist/parts/css/*.css", ['bs-stream']);
    gulp.watch("./dist/parts/js/*.js", ['bs-reload']);
});
