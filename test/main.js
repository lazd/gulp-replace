'use strict';

var concatStream = require('concat-stream');
var replacePlugin = require('../');
var fs = require('fs');
var should = require('should');
var File = require('vinyl');

describe('gulp-replace', function() {
  describe('replacePlugin()', function() {
    var replacements;

    beforeEach(function () {
      replacements = [
        'cow',
        'chicken',
        'duck',
        'person'
      ];
    });

    describe('buffered input', function () {
      var file, check;

      beforeEach(function () {
        file = new File({
          path: 'test/fixtures/helloworld.txt',
          contents: fs.readFileSync('test/fixtures/helloworld.txt')
        });

        check = function (stream, done, cb) {
          stream.on('data', function (newFile) {
            cb(newFile);
            done();
          });

          stream.write(file);
          stream.end();
        };
      });

      it('should replace string on a buffer', function(done) {
        var stream = replacePlugin('world', 'person');

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a buffer', function(done) {
        var stream = replacePlugin(/world/g, 'person');

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a buffer with a function', function(done) {
        var stream = replacePlugin(/world/g, function() { return 'person'; });

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace string on a buffer with a function', function(done) {
        var stream = replacePlugin('world', function() { return 'person'; });

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });


      it('should call function once for each replacement when replacing a string on a buffer', function(done) {
        var stream = replacePlugin('world', function() { return replacements.shift(); });
        check(stream, done, function (newFile) {

          String(newFile.contents).should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });


      it('should call function once for each replacement when replacing a regex on a buffer', function(done) {
        var stream = replacePlugin(/world/g, function() { return replacements.shift(); });

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });

      it('should trigger events on a buffer', function(done) {
        var stream = replacePlugin('world', 'elephant')
        stream.on('finish', function() {
          // No assertion required, we should end up here, if we don't the test will time out
          done();
        });

        stream.write(file);
        stream.end();
      });
    });

    describe('streamed input', function () {
      var file, check;

      beforeEach(function () {
        file = new File({
          path: 'test/fixtures/helloworld.txt',
          contents: fs.createReadStream('test/fixtures/helloworld.txt')
        });

        check = function (stream, done, cb) {
          stream.on('data', function(newFile) {
            newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
              cb(data);
              done();
            }));
          });

          stream.write(file);
          stream.end();
        };
      });

      it('should replace string on a stream', function(done) {
        var stream = replacePlugin('world', 'person');
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a stream', function(done) {
        var stream = replacePlugin(/world/g, 'person');
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a stream with a function', function(done) {
        var stream = replacePlugin(/world/g, function() { return 'person'; });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace string on a stream with a function', function(done) {
        var stream = replacePlugin('world', function() { return 'person'; });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should call function once for each replacement when replacing a string on a stream', function(done) {
        var stream = replacePlugin('world', function() { return replacements.shift(); });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });

      it('should call function once for each replacement when replacing a regex on a stream', function(done) {
        var stream = replacePlugin(/world/g, function() { return replacements.shift(); });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });
    });

    describe('options', function () {
      describe('skipBinary', function () {
        var stream;

        beforeEach(function () {
          stream = replacePlugin('world', 'person', {skipBinary: true});
        });

        it('should ignore binary files when skipBinary is enabled', function(done) {
          var file = new File({
            path: 'test/fixtures/binary.png',
            contents: fs.readFileSync('test/fixtures/binary.png')
          });

          stream.on('data', function(newFile) {
            newFile.contents.should.eql(fs.readFileSync('test/expected/binary.png'));
            done();
          });

          stream.write(file);
          stream.end();
        });

        it('should replace string on non binary files when skipBinary is enabled', function(done) {
          var file = new File({
            path: 'test/fixtures/helloworld.txt',
            contents: fs.createReadStream('test/fixtures/helloworld.txt')
          });

          stream.on('data', function(newFile) {
            newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
              data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
              done();
            }));
          });

          stream.write(file);
          stream.end();
        });

      });
    });
  });
});
