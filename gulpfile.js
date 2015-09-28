'use strict';

// duh
var gulp = require('gulp');

// bundles all our files together and lets use require/import in the browser
// Also transforms JS files in the process if you want.
var browserify = require('browserify');
// gulp works with vinyl streams, this is used to create a vinyl stream from browserify output
var source = require('vinyl-source-stream');
// todo: not sure why we need this 
var buffer = require('vinyl-buffer');
// minfies JS files
var uglify = require('gulp-uglify');
// creates sourcemaps so our LESS and JS are easily debuggable
var sourcemaps = require('gulp-sourcemaps');
// general utility functions like gutil.log
var gutil = require('gulp-util');
// lets us watch for file changes in a way that works with browserify
var watchify = require('watchify');
// plugs into browserify's transform stage and gives us ES6 and JSX support.
var babelify = require('babelify');
// lets us watch for file changes (non-broswerify)
var watch = require('gulp-watch');
// lets us batch up watch callbacks so we only rebuild once if there many events
var batch = require('gulp-batch');
// lets us process .less files into css
var less = require('gulp-less');
// renames files for cache-breaking, and updates references to those files in js/html/css files
var revAll = require('gulp-rev-all');
// deletes files, we use it to clean things up
var del = require('del');
// stream API we need to help clean up after gulp-rev-all
var through = require('through2');

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

function clean() {
    return del([PATHS.dist]);
}

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

gulp.task('clean', clean);

gulp.task('html', ['clean'], function() {
    return buildHtml();
});
gulp.task('html-watch', ['clean'], function() {
    watch(PATHS.html, batch(function(events, done) {
        gulp.start('html', done);
    }));
    return buildHtml();
});

gulp.task('js', ['clean'], function() {
    return buildJs();
});
gulp.task('js-watch', ['clean'], function() {
    return buildJs(true);
});

gulp.task('less', ['clean'], function() {
    return buildLess();
});
gulp.task('less-watch', ['clean'], function() {
    watch(PATHS.less, batch(function(events, done) {
        gulp.start('less', done);
    }));
    return buildLess();
});

gulp.task('content', ['clean'], function() {
    return buildContent();
});
gulp.task('content-watch', ['clean'], function() {
    watch(PATHS.content, batch(function(events, done) {
        gulp.start('content', done);
    }));
    return buildContent();
});

gulp.task('config', ['clean'], function() {
    return buildConfig();
});
gulp.task('config-watch', ['clean'], function() {
    watch(PATHS.configjs, batch(function(events, done) {
        gulp.start('config', done);
    }));
    return buildConfig();
});

gulp.task('rev', ['js', 'html', 'less', 'content', 'config'], function() {
    var ra = new revAll({
        dontRenameFile: [/^.*\/config\.js$/g, /^.*\.html$/g],
        dontUpdateReference: [/^.*\/config\.js$/g],
        hashLength: 5
    });
    return gulp.src(PATHS.dist + '/**')
        // This will rename files with cache-breaking filenames, 
        // and also automatically update any references to those files in css/js/html
        .pipe(ra.revision())
        // write the newly named files to DIST
        .pipe(gulp.dest(PATHS.dist))
        // lets clean up the original file names which are still there
        .pipe(through.obj(function(file, enc, cb) {
            // for each file, if the originalPath is difference than the current one
            // then it was a renamed file. Delete the original.
            if (file.revOrigPath !== file.path) {
                del(file.revOrigPath);
            }
            return cb();
        }));
});

// 'gulp build' or just 'gulp' is what you would normally run to just get a build output.
// This runs the whole process as well as rev-all(), which creates cache-busting file names
// for static assets.
gulp.task('build', ['rev']);
gulp.task('default', ['build']);

// 'gulp watch' will build everything and then watch for changes to js/less/html, and rebuild
// whatever needs to be rebuild if there are changes. Note that this does NOT use rev-all()
// since you can't really incrementally update assets without rebuilding the whole thing,
// since a change to a JS file, for example, will cause there to be a new file name, which
// means the HTML file referencing it must change, too.
// TODO: Maybe just simplify and make watch rebuild everything every time
gulp.task('watch', ['js-watch', 'html-watch', 'less-watch', 'content-watch', 'config-watch']);



