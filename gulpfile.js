// Dependencies
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const jsonlint = require('gulp-jsonlint');

// Files
const jsFiles = [
    './bin/*.js'
];

const jsonFiles = [
    './package.json'
];

// Lint JavaScript files
gulp.task('lint:js', gulp.series(function(done) { 
    gulp.src(jsFiles)
        .pipe(jshint());
    done();
}));

// Lint JSON files
gulp.task('lint:json', gulp.series(function(done) { 
    gulp.src(jsonFiles)
        .pipe(jsonlint())
        .pipe(jsonlint.failAfterError())
        .pipe(jsonlint.reporter());
    done();
}));

// Tasks
gulp.task('lint', gulp.parallel('lint:js', 'lint:json', function(done) {
  done();
}));
