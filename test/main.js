'use strict';

var concatStream = require('concat-stream');
var replacePlugin = require('../');
var fs = require('fs');
var should = require('should');
var File = require('vinyl');

describe('gulp-replace', function() {
  describe('replacePlugin()', function() {
    var replacements;

    var checkBuffered = function (file, stream, done, cb) {
      stream.on('data', function (newFile) {
        cb(newFile);
        done();
      });

      stream.write(file);
      stream.end();
    };

    var checkStreamed = function (file, stream, done, cb) {
      stream.on('data', function(newFile) {
        newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
          cb(data);
          done();
        }));
      });

      stream.write(file);
      stream.end();
    };

    beforeEach(function () {
      replacements = [
        'cow',
        'chicken',
        'duck',
        'person'
      ];
    });

    describe('buffered input', function () {
      var file;

      beforeEach(function () {
        file = new File({
          path: 'test/fixtures/helloworld.txt',
          contents: fs.readFileSync('test/fixtures/helloworld.txt')
        });
      });

      it('should replace string on a buffer', function(done) {
        var stream = replacePlugin('world', 'person');

        checkBuffered(file, stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a buffer', function(done) {
        var stream = replacePlugin(/world/g, 'person');

        checkBuffered(file, stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a buffer with a function', function(done) {
        var stream = replacePlugin(/world/g, function() { return 'person'; });

        checkBuffered(file, stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace string on a buffer with a function', function(done) {
        var stream = replacePlugin('world', function() { return 'person'; });

        checkBuffered(file, stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });


      it('should call function once for each replacement when replacing a string on a buffer', function(done) {
        var stream = replacePlugin('world', function() { return replacements.shift(); });
        checkBuffered(file, stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });


      it('should call function once for each replacement when replacing a regex on a buffer', function(done) {
        var stream = replacePlugin(/world/g, function() { return replacements.shift(); });

        checkBuffered(file, stream, done, function (newFile) {
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
      var file;

      beforeEach(function () {
        file = new File({
          path: 'test/fixtures/helloworld.txt',
          contents: fs.createReadStream('test/fixtures/helloworld.txt')
        });
      });

      it('should replace string on a stream', function(done) {
        var stream = replacePlugin('world', 'person');
        checkStreamed(file, stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a stream', function(done) {
        var stream = replacePlugin(/world/g, 'person');
        checkStreamed(file, stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a stream with a function', function(done) {
        var stream = replacePlugin(/world/g, function() { return 'person'; });
        checkStreamed(file, stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace string on a stream with a function', function(done) {
        var stream = replacePlugin('world', function() { return 'person'; });
        checkStreamed(file, stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should call function once for each replacement when replacing a string on a stream', function(done) {
        var stream = replacePlugin('world', function() { return replacements.shift(); });
        checkStreamed(file, stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });

      it('should call function once for each replacement when replacing a regex on a stream', function(done) {
        var stream = replacePlugin(/world/g, function() { return replacements.shift(); });
        checkStreamed(file, stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });
    });

    describe('special cases', function() {
      it('should replace empty lines on a buffer', function(done) {
        var stream = replacePlugin(/^\s*\n/gm, '\n');

        var file = new File({
          path: 'test/fixtures/blank.txt',
          contents: fs.readFileSync('test/fixtures/blank.txt')
        });

        checkBuffered(file, stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/blank.txt', 'utf8'));
        });
      });

      it('should replace empty lines on a stream', function(done) {
        var stream = replacePlugin(/^\s*\n/gm, '');

        var file = new File({
          path: 'test/fixtures/blank.txt',
          contents: fs.createReadStream('test/fixtures/blank.txt')
        });

        checkStreamed(file, stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/blank.txt', 'utf8'));
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
