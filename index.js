var es = require('event-stream');
var rs = require('replacestream');
var istextorbinary = require('istextorbinary');

// Escape regexp characters
// From: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = function(search, replacement, options) {
  return es.map(function(file, callback) {
    var searchIsString = typeof search === 'string' || search instanceof String
    var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
    var isBuffer = file.contents instanceof Buffer;

    function doReplace() {
      if (isStream) {
        file.contents = file.contents.pipe(rs(search, replacement));
      } else if (isBuffer) {
        if (searchIsString) {
        	search = new RegExp(escapeRegExp(search), 'g');
        }
        file.contents = new Buffer(String(file.contents).replace(search, replacement));
      }
      callback(null, file);
    }

    if (options && options.skipBinary) {
      istextorbinary.isText('', file.contents, function(err, result) {
        if (err) {
          return callback(err, file);
        }
        
        if (!result) {
          return callback(null, file);
        } else {
          doReplace();
        }
      });
    } 
    else {
      doReplace();
    }

  });
};
