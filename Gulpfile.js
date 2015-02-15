var gulp  = require('gulp')
,   to5   = require('gulp-6to5')
,   mocha = require('gulp-mocha');

gulp.task('build', function () {
  return gulp.src('lib/*.js')
    .pipe(to5())
    .pipe(gulp.dest('build'));
});

gulp.task('test', function () {
  return gulp.src('test/*.test.js').pipe(mocha());
});

gulp.task('dev', function () {
  gulp.watch('lib/*', ['build']);
});

gulp.task('default', function () {
  gulp.watch(['lib/index.js', 'test/*.test.js'], ['test']);
});
