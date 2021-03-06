const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const path = require('path');
const mkdirp = require('mkdirp');
const isparta = require('isparta');

const manifest = require('./package.json');
const config = manifest.nodeBoilerplateOptions;
const mainFile = manifest.main;
const destinationFolder = path.dirname(mainFile);


// Remove the built files
gulp.task('clean', function(cb) {
  del([destinationFolder], cb);
});

// Build two versions of the library
gulp.task('build', ['clean'], function() {

  // Create our output directory
  mkdirp.sync(destinationFolder);
  return gulp.src(['src/**/*.js', '!src/**/.*#*'])
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(gulp.dest(destinationFolder));
});

function test() {
  return gulp.src(['test/setup/node.js',
                   'test/unit/**/*.js',
                   '!test/unit/**/.#*'], {read: false})
    .pipe($.plumber())
    .pipe($.mocha({ globals: config.mochaGlobals}));
}

// Make babel preprocess the scripts the user tries to import from here on.
require('babel/register');

gulp.task('coverage', function(done) {
  gulp.src(['src/*.js', '!src/.#*'])
    .pipe($.plumber())
    .pipe($.istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      return test()
      .pipe($.istanbul.writeReports())
      .on('end', done);
    });
});

// Lint and run our tests
gulp.task('test', test);


// Run the headless unit tests as you make changes.
gulp.task('watch', ['test'], function() {
  gulp.watch(['src/**/*', 'test/**/*', 'package.json', '**/.jshintrc', '.jscsrc'], ['test']);
});

// An alias of test
gulp.task('default', ['test']);
