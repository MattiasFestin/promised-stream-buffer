'use strict';
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    istanbul = require('gulp-istanbul'),
    mocha = require('gulp-mocha'),
    notify = require('gulp-notify'),
    exec = require('child_process').exec,
    watching = false;

gulp.task('pre-test', function () {
  return gulp.src(['src/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', [], function () {
  return gulp.src(['test/**/*.spec.js'])
    .pipe(mocha({
        reporter: 'spec',
        globals: {
            should: require('should')
        }
    }))
    .on('error', notify.onError(function (error) {
        return 'Test failed: ' + error.message + '\n' + error.stack;
    }))
    .pipe(istanbul.writeReports())
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 100 } }))
    /*.on('error', notify.onError(function (error) {
        return 'Coverage failed: ' + error.message;
    }))*/
    //.pipe(notify())
    ;
});

gulp.task('set-watch', function () {
    watching = true;
});

gulp.task('watch', ['set-watch', 'test'], function () {
    gulp.watch(['src/**/*.js', 'test/**/*.spec.js'], ['test']);
});

gulp.task('build', ['test'], function (cb) {
    exec('docker build ' + __dirname, function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('default', ['test']);
