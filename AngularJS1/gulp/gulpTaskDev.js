'use strict';

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var bower = require('gulp-bower');
var cache = require('gulp-cache');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gulpNgConfig = require('gulp-ng-config');
var ignore = require('gulp-ignore');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var notify = require('gulp-notify');
var open = require('gulp-open');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var util = require('gulp-util');
var vendor = require('gulp-concat-vendor');
var server = require('gulp-express');
var gulpFilter = require('gulp-filter');
var mainBowerFiles = require('gulp-main-bower-files');
var config = require('../config/configServer.json');
var file = require('gulp-file');

// Gulp Task
// - Gestion des constantes de configuration par environnement
gulp.task('urlConfig', function () {
    return gulp.src('./config/configFileServiceUrl.json')
        .pipe(gulpNgConfig('myApp.config', {
            environment: (util.env.environment ? util.env.environment : 'local')
        }))
        .pipe(gulp.dest('./src/app/'))
});



// - Inspection du code javascript (détection des erreurs)
gulp.task('lint', function () {
    return gulp.src('src/app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// - Génération des styles css
gulp.task('styles', function () {
    return gulp.src(['src/scss/*.scss', './libs/bootstrap/dist/css/*.min.css', './libs/bootstrap-daterangepicker/daterangepicker.css'])
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('src/css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));

});

// - Fusion et compression des js
gulp.task('scripts', function () {
    return gulp.src(['src/app/**/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('src/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

gulp.task('scripts-vendor-concat', function () {
    var filterJS = gulpFilter('**/*.js', { restore: true });

    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('src/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// - Inclu
gulp.task('scripts-vendor', function () {
    var filterJS = gulpFilter('**/*.js', { restore: true });
   return gulp.src('./libs/moment/locale/fr.js')
    .pipe(vendor('locale.js'))
    .pipe(gulp.dest('./src/js/'));
});

// Création du fichier index.html avec injection des js et css
gulp.task('index', function () {
    return gulp.src('src/*.html')
        .pipe(inject(gulp.src(['src/js/vendor.js', 'src/js/locale.js', 'src/app/**/*.js', 'src/css/**/*.css'], {
            read: false
        }), {
            ignorePath: 'src',
            addRootSlash: false
        }))
        .pipe(gulp.dest('src'))
        .pipe(notify({
            message: 'Index task complete'
        }));
});

// Watch Files For Changes
gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch(['./src/app/**/*.js', './src/css/**/*.css', './src/**/*.html'], ['index']);
    gulp.watch('./application/back/**/*.js', ['server']);
});



gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.run(['server.js']);

    gulp.watch(['./src/app/**/*.js', './application/back/**/*.js', './src/css/**/*.css', './src/**/*.html'], server.notify);

    gulp.watch('src/scss/**/*.scss', ['styles']);
    gulp.watch(['server.js'], [server.run]);
});

gulp.task('open', function () {
    var options = {
        uri: config.serverLocal.server +config.serverLocal.port,
        app: 'chrome'
    };
    gulp.src(__filename)
        .pipe(open(options));
});


gulp.task('icons', function() {
    return gulp.src('./libs/bootstrap/fonts/**.*')
        .pipe(gulp.dest('./src/fonts'));
});