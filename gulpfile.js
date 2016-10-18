'use strict';

/**
 * Config
 * ========================================================================== */
var PATH_SOURCE = './challenges';
var PATH_BUILD = './dist';
var AUTOPREFIXER_BROWSERS = ['> 1%', 'last 2 versions', 'Firefox ESR'];


/**
 * Node packages
 * ========================================================================== */
var browserSync = require('browser-sync').create(),
  htmlInjector = require("bs-html-injector"),
  del = require('del'),
  gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  runSequence = require('run-sequence');


/**
 * clean
 *
 * Delete output directory.
 * ========================================================================== */

gulp.task('build:clean', function () {
  return del([PATH_BUILD]);
});


/**
 * copy
 *
 * Copy all non-SASS files.
 * ========================================================================== */

gulp.task('build:copy', function () {
  return gulp.src([PATH_SOURCE + '/**/*', '!./challenges/**/*.scss'])
    .pipe(gulp.dest(PATH_BUILD))
});

/**
 * css
 *
 * Compile SASS to CSS, create source maps and add vendor prefixes
 * ========================================================================== */

gulp.task('build:css', function () {
  return gulp.src(PATH_SOURCE + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS, cascade: false}))
    .pipe(gulp.dest(PATH_BUILD + '/.'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});


/**
 * build
 *
 * Run all initial tasks.
 * ========================================================================== */

gulp.task('build', function (done) {
  runSequence(
    'build:clean', 'build:copy', 'build:css',
    function () {
      done();
    }
  );
});


/**
 * develop
 *
 * Starts a dev server, watching source files and auto injects/reloads on
 * changes.
 * ========================================================================== */

gulp.task('develop', ['build'], function () {

  browserSync.use(htmlInjector, {
    files: PATH_BUILD + '/**/*.html'
  });

  browserSync.init({
    port: 9183,
    server: {baseDir: PATH_BUILD},
    notify: false,
    open: 'external',
    logPrefix: 'bbuildd',
    ui: {port: 9184},
    reloadOnRestart: true,
    logFileChanges: false,
    timestamps: false
  });

  gulp.watch([PATH_SOURCE + '/**/*', '!' + PATH_SOURCE + '/**/*.scss'], ['build:copy']);
  gulp.watch([PATH_SOURCE + '/**/*.scss'], ['build:css']);
});
