
/*
 * gulp-replace
 * https://github.com/lazd/gulp-replace
 *
 * Copyright (c) 2014 Larry Davis
 * Licensed under the MIT license.
 * https://github.com/lazd/gulp-replace/blob/master/LICENSE-MIT
 */

var through2 = require('through2');
var PluginError = require('gulp-util').PluginError;
var rs = require('replacestream');
var _ = require('lodash');
var Replacer = require('pattern-replace');

module.exports = function () {

  'use strict';

  var isPatternSearch = arguments.length === 1;
  var opts;
  var search;
  var replacement;
  if (isPatternSearch === false) {
    search = arguments[0];
    replacement = arguments[1];
  } else {
    opts = arguments[0];
  }

  // through

  return through2.obj(function (file, enc, cb) {

    if (file.isNull()) {
      this.push(file); // nothing if no contents
      return cb();
    }

    if (file.isStream()) {
      if (isPatternSearch === true) {
        this.emit('error', new PluginError('gulp-replace',
          'Cannot do pattern-replace on a stream'));
        return cb();
      } else {
        var isRegExp = _.isRegExp(search);
        if (isRegExp === true) {
          this.emit('error', new PluginError('gulp-replace',
            'Cannot do regexp replace on a stream'));
          return cb();
        }
        if (isRegExp === false && _.isFunction(replacement) === true) {
          this.emit('error', new PluginError('gulp-replace',
            'Cannot do string replace with a function as replacement value'));
          return cb();
        }
      }
      // piped replace
      file.contents = file.contents.pipe(rs(search, replacement));
    }

    if (file.isBuffer()) {
      // mixes with defaults
      var options = _.defaults(opts || {}, {
        patterns: []
      });
      if (isPatternSearch === false) {
        var patterns = options.patterns;
        patterns.push({
          match: search,
          replacement: replacement
        });
        // prefix less
        options.usePrefix = false;
      }
      var result = new Replacer(options).replace(file.contents.toString());
      if (result !== false) {
        file.contents = new Buffer(result);
      }
    }

    this.push(file);
    return cb();

  });

};
