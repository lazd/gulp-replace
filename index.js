var es = require('event-stream');
var rs = require('replacestream');
var stream = require('stream');

module.exports = function(search, replace) {
  var doReplace = function(file, callback) {
    if (file.contents instanceof stream.Readable) {
      file.contents = file.contents.pipe(rs(search, replace));
    }
    else if (file.contents instanceof Buffer) {
      file.contents = Buffer(String(file.contents).split(search).join(replace));
    }
    callback(null, file);
  };

  return es.map(doReplace);
};
