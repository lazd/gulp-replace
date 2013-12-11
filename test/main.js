var replacePlugin = require('../');
var path = require('path');
var should = require('should');
var gutil = require('gulp-util');
require('mocha');

var makeFile = function(contents) {
  return new gutil.File({
    path: 'test/file.txt',
    cwd: 'test/',
    base: 'test/',
    contents: contents
  });
};

describe('gulp-replace', function() {
  describe('replacePlugin()', function() {
    it('should replace regular expression', function(done) {
      var file = makeFile('foobar foobaz');

      var stream = replacePlugin(/foo(.{3})/g, '$1foo');
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);
        String(newFile.contents).should.equal('barfoo bazfoo');
      });
  
      stream.once('end', function() {
        done();
      });
  
      stream.write(file);
      stream.end();
    });
   
  });
});
