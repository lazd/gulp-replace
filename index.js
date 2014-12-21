'use strict';

var es = require('event-stream');
var rs = require('replacestream');
var istextorbinary = require('istextorbinary');

// Escape regexp characters
// From: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function doReplace(file, match, replacement) {
  var matchIsString = typeof match === 'string' || match instanceof String;

  if (file.isStream()) {
    file.contents = file.contents.pipe(rs(match, replacement));
  } else if (file.isBuffer()) {
    if (matchIsString) {
      // Workaround: cannot use str.replace(str, str, 'g') in v8
      match = new RegExp(escapeRegExp(match), 'g');
    }
    file.contents = new Buffer(file.contents.toString().replace(match, replacement));
  }
}

module.exports = function(replaces, options, _options) {
  return es.map(function(file, callback) {
    if (!(replaces instanceof Array)) {
      replaces = [
        {
          match: replaces,
          replacement: options
        }
      ];
      options = _options;
    }
    
    if (options && options.skipBinary) {
      var skip = istextorbinary.isBinarySync(file.path, file.contents);
      if (skip) {
        return callback(skip instanceof Error ? skip : null, file);
      }
    }

    for (var i = 0; i < replaces.length; i++) {
      doReplace(file, replaces[i].match, replaces[i].replacement);
    }
    callback(null, file);
  });
};
