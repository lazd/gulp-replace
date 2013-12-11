# gulp-replace [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> A string replace plugin for gulp 3

## Usage

First, install `gulp-replace` as a development dependency:

```shell
npm install --save-dev gulp-replace
```

Then, add it to your `gulpfile.js`:

```javascript
var jshint = require('gulp-replace');

gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(replace('foo', 'bar'))
    .pipe(gulp.dest('build/file.txt'));
});
```

## API

### replace(search, replace)

#### search
Type: `String`

The string to search for.

#### replace
Type: `String`

The replacement string.

[travis-url]: http://travis-ci.org/lazd/gulp-replace
[travis-image]: https://secure.travis-ci.org/lazd/gulp-replace.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-replace
[npm-image]: https://badge.fury.io/js/gulp-replace.png
