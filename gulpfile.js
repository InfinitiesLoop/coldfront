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
    js: "./src/js/**/*.js",
    html: "./src/**/*.html",
    less: "./src/**/site.less",
    content: "./src/content/**/*",
    dist: "./dist",

    mainjs: "./src/js/main.js",
    configjs: "./src/js/config.js",
    bundlejs: "app.js",
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
        .pipe(uglify({
            compress: {
                // don't drop "debugger;" statements, these can sometimes
                // come in handy! Just don't ship them to prod you silly developer.
                drop_debugger: false
            }
        }))
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

function buildContent() {
    // just copies content files to dist. 
    return gulp.src(PATHS.content)
        .pipe(gulp.dest(PATHS.dist + '/content'));
}

function buildConfig() {
    return gulp.src(PATHS.configjs)
        .pipe(gulp.dest(PATHS.dist + '/js'));
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

gulp.task('content', function() {
    return buildContent();
});
gulp.task('content-watch', function() {
    watch(PATHS.content, batch(function(events, done) {
        gulp.start('content', done);
    }));
    return buildContent();
});

gulp.task('config', function() {
    return buildConfig();
});
gulp.task('config-watch', function() {
    watch(PATHS.configjs, batch(function(events, done) {
        gulp.start('config', done);
    }));
    return buildConfig();
});

gulp.task('build', ['js', 'html', 'less', 'content', 'config']);
gulp.task('watch', ['js-watch', 'html-watch', 'less-watch', 'content-watch', 'config-watch']);
gulp.task('default', ['watch']);

