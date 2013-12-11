var es = require('event-stream');

module.exports = function(search, replace) {
  var doRegexReplace = function(file, callback) {
    var result = String(file.contents).replace(search, replace);

    file.contents = new Buffer(result);

    callback(null, file);
  };

  return es.map(doRegexReplace);
};
