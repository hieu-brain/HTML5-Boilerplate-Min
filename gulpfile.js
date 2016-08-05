var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var path = require('path');
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
        ghostMode: false,
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
    return sass('src/scss/site.scss', { style: 'expanded' })
        .pipe(autoprefixer({
            browsers: ["last 2 versions", "Android >= 4.2", "ios >= 8", "ie >= 9"]
        }))
        .pipe(gulp.dest('dist/css'));
});

//Sass
gulp.task('copy-html', function() {
    return gulp.src('src/*.html')
        .pipe(gulp.dest('dist'));
});

// Reload Browser
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
});

//Watches task
gulp.task('watch', function(){
    // Watch .scss files
    // gulp.watch('src/css/**/*.scss', ['styles']);
    watch('./**/scss/**/*.scss',
        function (file) {
            var scssPath = path.dirname(file.path).split(path.sep).slice(0, path.dirname(file.path).split(path.sep).lastIndexOf('scss') + 1).join(path.sep);
            return sass(scssPath, {
                style: 'expanded',
                compass: true,
                sourcemap: false
            })
                .on('error', function (err) {
                    console.error('Error', err.message);
                })
                .pipe(sourcemaps.write(gulp.dest(path.resolve(scssPath, './dist/css/'))))
                .pipe(gulp.dest(path.resolve(scssPath, './dist/css/')))
                .pipe(browserSync.stream());
        });

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/**/*', ['images']);

    // Watch html files
    gulp.watch('src/*.html', ['copy-html','bs-reload']);
});

// Run
gulp.task('default', ['watch', 'server', 'styles', 'copy-html', 'scripts'], function () {
    gulp.watch("./dist/*.html", ['bs-reload']);
    gulp.watch("./dist/css/*.css", ['bs-reload']);
    gulp.watch("./dist/js/*.js", ['bs-reload']);
});
