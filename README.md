# gulp-replace [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]
> A string replace plugin for gulp 3

gulp-replace can be called with a single replacement, or an array or replacements. And you can tell it to skip binary files.

## Usage

First, install `gulp-replace` as a development dependency:

```shell
npm install --save-dev gulp-replace
```

Then, add it to your `gulpfile.js`:

```javascript
var replace = require('gulp-replace');

gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(replace(/foo(.{3})/g, '$1foo'))
    .pipe(gulp.dest('build/file.txt'));
});
```

Or with an array of replacements:

```javascript
var replacements = [
  {
    match: /foo(.{3})/g,
    replacement: '$1foo'
  },
  {
    match: 'world',
    replacement: 'person'
  }
];
gulp.task('templates', function(){
  gulp.src(['file.txt'])
    .pipe(replace(replacements))
    .pipe(gulp.dest('build/file.txt'));
});
```


## API

If you know `string.replace()`, you already know how it works. See the [MDN documentation for string.replace()]. (Except that V8, node and chrome's engine, doesn't accept a third parameter with flags)

### replace(match, replacement[, options])

#### match
Type: `String` or `RegExp`

The string or a regexp pattern to search for.

If you use a string, the replacement will automatically be global. If you use a regexp, you must specify it with the global flag (`'g'`), like this: `/.../g`

See the [MDN documentation for RegExp] for details about creating RegExps.

#### replacement
Type: `String` or `Function`

The replacement string or function. If `replacement` is a function, it will be called once for each match and will be passed the string that is to be replaced.

Note that the string supports special replacement patterns as specified in: [MDN documentation for the special replacement parameters of string.replace()]

#### options
Type: `Object`

##### options.skipBinary
Type: `boolean`  
Default: `false`

Skip binary files

### replace(replaces[, options])

#### replaces
Type: `Array of Objects`

Each object in the array defines a replacement. This array can be defined once and reused multiple times in different parts of your code.

The properties: `match` and `replacement` can have the same values as in `replace(match, replacement[, options])`.

The array will therefore look like:

```javascript
[
  {
    match: '@NAME',
    replacement: 'John Doe'
  },
  {
    match: /id-([a-zA-Z])-([0-9])/g,
    replacement: function(match, p1, p2, offset, string) {
      return 'Id: ' + p1.toLowerCase() + '-' + parseInt(p2, 10);
    }
  }
]
```


[MDN documentation for RegExp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[MDN documentation for string.replace()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter
[MDN documentation for the special replacement parameters of string.replace()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter

[travis-url]: http://travis-ci.org/lazd/gulp-replace
[travis-image]: https://secure.travis-ci.org/lazd/gulp-replace.svg?branch=master
[npm-url]: https://npmjs.org/package/gulp-replace
[npm-image]: https://badge.fury.io/js/gulp-replace.svg
