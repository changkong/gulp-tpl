gulp-tpl
========

data(yaml/json) + [filter(js)] + tpl(handlebars/ejs) -> html

State
=====

[![NPM](https://nodei.co/npm/gulp-tpl.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-tpl/)

Usage
=====

data + tpl -> html
------------------

demo1.yaml

```yaml
name: handlebars
```

demo1.hbs

```html
<div>{{name}}</div>
```

gulpfile.js

```javascript
var gulp = require('gulp');
var savefile = require('gulp-savefile');
var tpl = require('gulp-tpl');

gulp.task('default', function() {
  return gulp.src(['demo1.hbs'])
        .pipe(tpl.html())
        .pipe(savefile());
});
```

output: demo1.html

```html
<div>handlebars</div>
```

data + filter + tpl -> html
---------------------------

demo1.yaml

```yaml
name: handlebars
```

demo1.js

```javascript
'use strict';
module.exports.filter = function(data) {
  data = data || {};
  data.name += " hello world!";
  return data;
};
```

demo1.hbs

```html
<div>{{name}}</div>
```

gulpfile.js

```javascript
var gulp = require('gulp');
var savefile = require('gulp-savefile');
var tpl = require('gulp-tpl');

gulp.task('default', function() {
  return gulp.src(['demo1.hbs'])
        .pipe(tpl.html())
        .pipe(savefile());
});
```

output: demo1.html

```html
<div>handlebars hello world!</div>
```

Test
====

* run `npm test`
* example `./test`

Note
====

gulp-tpl.savefile() is deprecated, please use gulp-savefile

License
=======

MIT License