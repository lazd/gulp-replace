var replacePlugin = require('../');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var should = require('should');
var gutil = require('gulp-util');
require('mocha');




describe('gulp-replace', function() {
  describe('Use array of replacements', function() {
    it('should work with 0 replacement', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin([]);
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/fixtures/helloworld.txt', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should work with 1 replacement', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin([{match: 'world', replacement: 'person'}]);
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });
    
    it('should work with 2 replacements', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin([{match: 'world', replacement: 'person'}, {match: 'Hello', replacement: 'Bye'}]);
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8').replace(/Hello/g, 'Bye'));
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should check skipBinary', function(done) {
      var _options = Object.defineProperty({}, 'skipBinary', {
        get: function() {
          done();
          return true;
        }
      });
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin([], _options);

      stream.write(file);
      stream.end();
    });
  });
});
