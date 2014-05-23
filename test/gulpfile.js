var gulp = require('gulp');
var savefile =require('gulp-savefile');
var tpl = require('./../index.js');


gulp.task('default', function() {
  return gulp.src(['*.hbs', '*.ejs'])
        .pipe(tpl.html())
        .pipe(savefile());
});
