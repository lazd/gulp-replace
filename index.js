var es = require('event-stream');
var rs = require('replacestream');
var stream = require('stream');

module.exports = function(search, replacement) {
  var doReplace = function(file, callback) {
    var isRegExp = search instanceof RegExp;
    var isStream = file.contents instanceof stream.Readable;
    var isBuffer = file.contents instanceof Buffer;

    if (isRegExp && isStream) {
      return callback(new Error('gulp-replace: Cannot do regexp replace on a stream'), file);
    }

    if (!isRegExp && typeof replacement === 'function') {
      return callback(new Error('gulp-replace: Cannot do string replace with a function as replacement value'), file);
    }

    if (isStream) {
      file.contents = file.contents.pipe(rs(search, replacement));
      callback(null, file);
    }
    else if (isBuffer) {
      if (isRegExp) {
        file.contents = new Buffer(String(file.contents).replace(search, replacement));
      }
      else {
        file.contents = new Buffer(String(file.contents).split(search).join(replacement));
      }
      callback(null, file);
    }
    else {
      callback(null, file);
    }
  };

  return es.map(doReplace);
};
