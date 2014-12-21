var es = require('event-stream');
var rs = require('replacestream');
var stream = require('stream');
var istextorbinary = require('istextorbinary');

// Escape regexp characters
// From: http://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = function(search, replacement, options) {
  var doReplace = function(file, callback) {
    var isRegExp = search instanceof RegExp;
    var isStream = file.contents && typeof file.contents.on === 'function' && typeof file.contents.pipe === 'function';
    var isBuffer = file.contents instanceof Buffer;

    function doReplace() {
      if (isStream) {
        file.contents = file.contents.pipe(rs(search, replacement));
        return callback(null, file);
      }

      if (isBuffer) {
        if (!isRegExp) {
        	search = new RegExp(escapeRegExp(search), 'g');
        }
        file.contents = new Buffer(String(file.contents).replace(search, replacement));
        return callback(null, file);
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

  };

  return es.map(doReplace);
};
