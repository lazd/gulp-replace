var replacePlugin = require('../');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
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
    it('should replace on a stream', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.createReadStream('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin('world', 'person');
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        newFile.contents.pipe(es.wait(function(err, data) {
          should.not.exist(err);
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
          done();
        }));
      });

      stream.write(file);
      stream.end();
    });

    it('should replace on a buffer', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin('world', 'person');
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });
  });
});
