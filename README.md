gulp-tpl
========

data(yaml/json) + [filter(js)] + tpl(handlebars/ejs) -> html

State
=====

[![NPM](https://nodei.co/npm/gulp-tpl.png?downloads=true&stars=true)](https://nodei.co/npm/gulp-tpl/)

Usage
=====

Note
----

* **data file:** `demo.yaml / demo.json`
* **filter file:** `demo.js`
* **tpl file:** `demo.hbs / demo.ejs`

* **note:** **base name is both `demo`**

gulpfile.js
-----------

```javascript
var gulp = require('gulp');
var savefile = require('gulp-savefile');
var tpl = require('gulp-tpl');

gulp.task('default', function() {
  return gulp.src('demo.hbs') // or demo.ejs/demo.js/demo.yaml/demo.json
        .pipe(tpl.html())
        .pipe(savefile());
});
```

data + tpl -> html
------------------

* **demo.yaml**

```yaml
name: handlebars
```

* **demo.hbs**

```html
<div>{{name}}</div>
```

* **output: demo.html**

```html
<div>handlebars</div>
```

data + filter + tpl -> html
---------------------------

* **demo.yaml**

```yaml
name: handlebars
```

* **demo.js**

```javascript
'use strict';
module.exports.filter = function(data) {
  data.name += " hello world!";
  return data;
};
```

* **demo.hbs**

```html
<div>{{name}}</div>
```

* **output: demo.html**

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