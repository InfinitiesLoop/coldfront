'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var watchify = require('watchify');
var babelify = require('babelify');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var less = require('gulp-less');

var PATHS = {
    mainjs: "./src/js/main.js",
    js: "./src/js/**/*.js",
    html: "./src/**/*.html",
    less: "./src/**/site.less",
    bundlejs: "app.js",
    dist: "./dist"
};

function buildJs(enableWatch) {
    var b = browserify({
        entries: PATHS.mainjs,
        debug: true
    });
    b.on('log', gutil.log);

    if (enableWatch) {
        b = watchify(b);
        b.on('update', buildJs);
    }

    b = b.transform(babelify);

    return b.bundle()
        .pipe(source(PATHS.bundlejs))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(PATHS.dist + '/js'));
}

function buildHtml() {
    // just copies src html files to dist. 
    return gulp.src(PATHS.html)
        .pipe(gulp.dest(PATHS.dist));
}

function buildLess() {
    return gulp.src(PATHS.less)
        .pipe(less())
        .pipe(gulp.dest(PATHS.dist));
}

gulp.task('html', function() {
    return buildHtml();
});
gulp.task('html-watch', function() {
    watch(PATHS.html, batch(function(events, done) {
        gulp.start('html', done);
    }));
    return buildHtml();
});

gulp.task('js', function() {
    return buildJs();
});
gulp.task('js-watch', function() {
    return buildJs(true);
});

gulp.task('less', function() {
    return buildLess();
});
gulp.task('less-watch', function() {
    watch(PATHS.less, batch(function(events, done) {
        gulp.start('less', done);
    }));
    return buildLess();
});


gulp.task('build', ['js', 'html', 'less']);
gulp.task('watch', ['js-watch', 'html-watch', 'less-watch']);
gulp.task('default', ['watch']);

