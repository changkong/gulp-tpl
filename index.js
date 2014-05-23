'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var Handlebars = require('handlebars');
var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var ejs = require('ejs');

// 组合模板和数据生成网页
// 模板支持: Handlebars, ejs
// 数据支持: yaml
// 参数:
//   opts.partials: Handlebars 参数
//   opts.helpers: Handlebars 参数
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

    var hbsfile = path.join(dirname, name + ".hbs");
    var ejsfile = path.join(dirname, name + ".ejs");
    var yamlfile = path.join(dirname, name + ".yaml");
    var jsonfile = path.join(dirname, name + ".json");
    var htmlfile = path.join(dirname, name + ".html");

    var data = {};
    var errmsg = "";
    var datafile = "";
    try {
      if (fs.existsSync(yamlfile)) {
        datafile = yamlfile;
        data = yaml.safeLoad(fs.readFileSync(yamlfile, 'utf8'));
      } else if (fs.existsSync(jsonfile)) {
        datafile = jsonfile;
        data = JSON.$.parseJSON(fs.readFileSync(jsonfile, 'utf8'));
      }
    } catch (err) {
      errmsg = "[gulp-tpl.html error: " + datafile + "]  " + err;
    }

    if (errmsg==="") {
      var tplname = name;
      try {
        if (fs.existsSync(hbsfile)) {
          tplname += ".hbs";
          var tpl = fs.readFileSync(hbsfile, 'utf8');
          file.contents = new Buffer(Handlebars.compile(tpl)(data));
        } else if (fs.existsSync(ejsfile)) {
          tplname += ".ejs";
          var tpl = fs.readFileSync(ejsfile, 'utf8');
          data.filename = ejsfile;
          file.contents = new Buffer(ejs.render(tpl, data));
        }
      } catch (err) {
        errmsg = "[gulp-tpl.html error: " + path.join(dirname,tplname) + "]  " + err;
      }
    }

    if (errmsg!="") {
      if (options.ignoreErr) {
        gutil.log(errmsg);
      } else {
        this.emit('error', new gutil.PluginError('gulp-tpl.html', errmsg));
      }
    }

    file.path = htmlfile;
    this.push(file);
    cb();
  });
};
