'use strict';

// Example
// gulp

var gulp = require('gulp');

// Include Plugins
var runSequence = require('run-sequence');
var requireDir = require('require-dir');


requireDir('./gulp');


// Default Task
gulp.task('default', function (callback) {
    runSequence('urlConfig', 'styles', 'scripts', 'scripts-vendor','scripts-vendor-concat','icons', 'index', 'watch','server', 'open', callback);
});
