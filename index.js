const ReadableStream = require('readable-stream');
const ReplaceStream = require('replacestream');
const IsTextOrBinary = require('istextorbinary');

module.exports = function (search, _replacement, options) {
  if (!options) {
    options = {};
  }

  if (options.skipBinary === undefined) {
    options.skipBinary = true;
  }

  return new ReadableStream.Transform({
    objectMode: true,
    transform: function (file, enc, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }

      let replacement = _replacement;
      if (typeof _replacement === 'function') {
        // Pass the vinyl file object as this.file
        replacement = _replacement.bind({file: file});
      }

      function doReplace() {
        if (file.isStream()) {
          file.contents = file.contents.pipe(ReplaceStream(search, replacement));
          return callback(null, file);
        }

        if (file.isBuffer()) {
          if (search instanceof RegExp) {
            file.contents = Buffer.from(String(file.contents).replace(search, replacement));
          } else {
            let chunks = String(file.contents).split(search);

            let result;
            if (typeof replacement === 'function') {
              // Start with the first chunk already in the result
              // Replacements will be added thereafter
              // This is done to avoid checking the value of i in the loop
              result = [chunks[0]];

              // The replacement function should be called once for each match
              for (let i = 1; i < chunks.length; i++) {
                // Add the replacement value
                result.push(replacement(search));

                // Add the next chunk
                result.push(chunks[i]);
              }

              result = result.join('');
            } else {
              result = chunks.join(replacement);
            }

            file.contents = Buffer.from(result);
          }
          return callback(null, file);
        }

        callback(null, file);
      }

      if (options && options.skipBinary) {
        IsTextOrBinary.isText(file.path, file.contents, function (err, result) {
            if (err) {
              return callback(err, file);
            }

            if (!result) {
              callback(null, file);
            } else {
              doReplace();
            }
          }
        );

        return;
      }

      doReplace();
    }
  });
}
;
