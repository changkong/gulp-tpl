'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var Handlebars = require('handlebars');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

// 不使用 gulp.dest 存盘因为
// 1. gulp.dest 获取的文件路径依赖 file.relative
// 2. gulp.watch 时 gulp.src(event.path) 获取的 file.relative 仅有文件名
// 3. gulp.src 通过通配符匹配的文件，获取的 file.relative 是相对 gulp 启动目录的
module.exports.savefile = function (opts) {
  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-tpl.save', 'Streaming not supported'));
      return cb();
    }

    try {
      fs.writeFileSync(file.path, file.contents || '');
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-tpl.save', err));
    }

    this.push(file);
    cb();
  });
}

// 组合 Handlebars 和 yaml 自动生成网页
module.exports.html = function (opts) {

  var options = opts || {};
  //Go through a partials object
  if(options.partials){
    for(var p in options.partials){
      Handlebars.registerPartial(p, options.partials[p]);
    }
  }
  //Go through a helpers object
  if(options.helpers){
    for(var h in options.helpers){
      Handlebars.registerHelper(h, options.helpers[h]);
    }
  }

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-tpl.html', 'Streaming not supported'));
      return cb();
    }

    var filepath = file.path;
    var dirname = path.dirname(filepath);
    var basename = path.basename(filepath);
    var name = path.basename(filepath, path.extname(basename));

    var tplfile = path.join(dirname, name + ".hbs");
    var datafile = path.join(dirname, name + ".yaml");
    var htmlfile = path.join(dirname, name + ".html");

    var tpl = fs.readFileSync(tplfile, 'utf8');
    var data = {};
    if (fs.existsSync(datafile)) {
      data = yaml.safeLoad(fs.readFileSync(datafile, 'utf8'));
    }

    try {
      var template = Handlebars.compile(tpl);
      file.contents = new Buffer(template(data));
      file.path = htmlfile;
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-tpl.html', err));
    }

    this.push(file);
    cb();
  });
};
