'use strict';

// Example
// gulp
// gulp build --environment recette
// gulp build --environment production
// Example livraison :
// gulp delivery --environment integration
// gulp delivery --environment recette
// gulp delivery --environment prod
// Include gulp
var gulp = require('gulp');

// Include Plugins
var runSequence = require('run-sequence');
var requireDir = require('require-dir');


requireDir('./gulp');


// Default Task
gulp.task('default', function (callback) {
    runSequence('urlConfig', 'styles', 'scripts', 'scripts-vendor','scripts-vendor-concat','icons', 'index', 'watch','server', 'open', callback);
});
