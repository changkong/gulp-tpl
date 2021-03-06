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
// 模板支持: Handlebars/ejs
// 数据支持: yaml/json
// 过滤器支持: js
// 参数:
//   opts.ignoreErr: easy to watch and debug
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

    if (path.extname(name)===".filter") {
      name = name.substr(0, name.length-7);
    }

    var hbsfile = path.join(dirname, name + ".hbs");
    var ejsfile = path.join(dirname, name + ".ejs");
    var yamlfile = path.join(dirname, name + ".yaml");
    var jsonfile = path.join(dirname, name + ".json");
    var jsfile = path.join(dirname, name + ".filter.js");

    var errmsg = "";

    var data = {};

    // 读取数据文件
    var datafile = "";
    try {
      if (fs.existsSync(yamlfile)) {
        datafile = yamlfile;
        data = yaml.safeLoad(fs.readFileSync(yamlfile, 'utf8'));
      } else if (fs.existsSync(jsonfile)) {
        datafile = jsonfile;
        data = JSON.parse(fs.readFileSync(jsonfile, 'utf8'));
      }
    } catch (err) {
      errmsg = "[gulp-tpl.html error: " + datafile + "]  " + err;
    }

    // 读取设置变量
    if (options.data) {
      for(var attr in options.data){
          data[attr]=options.data[attr];
      }
    }

    // 调用过滤器
    var filter = function(data) {};
    if (errmsg==="") {
      if (fs.existsSync(jsfile)) {
        try {
          delete require.cache[require.resolve(jsfile)]; // 清除缓存
          filter = require(jsfile).filter;
          data = filter(data);
        } catch (err) {
          errmsg = "[gulp-tpl.html error: " + jsfile + "]  " + err;
        }
      }
    }

    // 如果是输出
    var isdatas = false;
    if (Object.prototype.toString.call(data) === '[object Array]') {
      if (data.length>0) {
        var d1=data[0];
        if (d1.filename && d1.data) {
          isdatas = true;
        }
      }
    }

    var outputs=[];
    if (isdatas) {
      outputs=data;
    } else {
      outputs.push({filename:name, data:data});
    }


    for (var i=0; i<outputs.length; i++) {
      var output=outputs[i];
      if (errmsg==="") {
        var tplname = name;
        try {
          var tpl = null;
          if (fs.existsSync(hbsfile)) {
            tplname += ".hbs";
            tpl = fs.readFileSync(hbsfile, 'utf8');
            file.contents = new Buffer(Handlebars.compile(tpl)(output.data));
          } else if (fs.existsSync(ejsfile)) {
            tplname += ".ejs";
            tpl = fs.readFileSync(ejsfile, 'utf8');
            output.data.filename = ejsfile;
            file.contents = new Buffer(ejs.render(tpl, output.data));
          }
        } catch (err) {
          errmsg = "[gulp-tpl.html error: " + path.join(dirname,tplname) + "]  " + err;
        }
      }

      if (errmsg!=="") {
        if (options.ignoreErr) {
          gutil.log(errmsg);
        } else {
          this.emit('error', new gutil.PluginError('gulp-tpl.html', errmsg));
        }
      }

      var outfile = file.clone();
      outfile.path = path.join(dirname, output.filename + ".html");
      this.push(outfile);
    }

    cb();
  });
};
