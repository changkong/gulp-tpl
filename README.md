gulp-tpl
========

[data(yaml/json)] + [data(gulp control)] + [filter(js)] + tpl(handlebars/ejs) -> html

State
=====

[![NPM](https://nodei.co/npm/gulp-tpl.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-tpl/)

Usage
=====

Note
----

* data file: `demo.yaml / demo.json`
* filter file: `demo.filter.js`
* tpl file: `demo.hbs / demo.ejs`

* **note1:** **base name is same `demo`**
* **note2:** **must `*.filter.js`**

gulpfile.js
-----------

```javascript
var gulp = require('gulp');
var savefile = require('gulp-savefile');
var tpl = require('gulp-tpl');

gulp.task('default', function() {
  return gulp.src('demo.hbs') // or demo.ejs/demo.filter.js/demo.yaml/demo.json
        .pipe(tpl.html())
        .pipe(savefile());
});
```

data + tpl -> html
------------------

* **demo.yaml**

```yaml
name: world
```

* **demo.hbs**

```html
<div>{{name}}</div>
```

* **output: demo.html**

```html
<div>world</div>
```

data + filter + tpl -> html
---------------------------

* **demo.yaml**

```yaml
name: world
```

* **demo.filter.js**

```javascript
'use strict';
module.exports.filter = function(data) {
  data.name = "hello " + data.name;
  return data;
};
```

* **demo.hbs**

```html
<div>{{name}}</div>
```

* **output: demo.html**

```html
<div>hello world</div>
```

data + gulp + filter + tpl -> html
---------------------------

gulpfile.js
-----------

```javascript
var gulp = require('gulp');
var savefile = require('gulp-savefile');
var tpl = require('gulp-tpl');

gulp.task('default', function() {
  return gulp.src('demo.hbs') // or demo.ejs/demo.filter.js/demo.yaml/demo.json
        .pipe(tpl.html({data:{v2:"from gulp"}}))
        .pipe(savefile());
});
```

* **demo.yaml**

```yaml
v1: from yaml
```

* **demo.filter.js**

```javascript
'use strict';
module.exports.filter = function(data) {
  data.v3 = "from filter";
  return data;
};
```

* **demo.hbs**

```html
<div>v1 {{v1}}</div>
<div>v2 {{v2}}</div>
<div>v3 {{v3}}</div>
```

* **output: demo.html**

```html
<div>v1 from yaml</div>
<div>v2 from gulp</div>
<div>v3 from filter</div>
```

option
------

* **ignoreErr**

ignore error, only log error msg, easy to watch and debug

```javascript
var gulp = require('gulp');
var savefile = require('gulp-savefile');
var tpl = require('gulp-tpl');

gulp.task('default', function() {
  return gulp.src('demo.hbs')
        .pipe(tpl.html({ignoreErr:true}))
        .pipe(savefile());
});
```

Test
====

* `npm test`
* examples `./test`

Deprecated
==========

gulp-tpl.savefile() is deprecated, please use gulp-savefile

License
=======

MIT License