'use strict';

const concatStream = require('concat-stream');
const replacePlugin = require('../');
const fs = require('fs');
const File = require('vinyl');

describe('gulp-replace', function() {
  describe('replacePlugin()', function() {
    let replacements;

    beforeEach(function () {
      replacements = [
        'cow',
        'chicken',
        'duck',
        'person'
      ];
    });

    describe('buffered input', function () {
      let file, check;

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
        const stream = replacePlugin('world', 'person');

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a buffer', function(done) {
        const stream = replacePlugin(/world/g, 'person');

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a buffer with a function', function(done) {
        const stream = replacePlugin(/world/g, function() { return 'person'; });

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace string on a buffer with a function', function(done) {
        const stream = replacePlugin('world', function() { return 'person'; });

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });


      it('should call function once for each replacement when replacing a string on a buffer', function(done) {
        const stream = replacePlugin('world', function() { return replacements.shift(); });
        check(stream, done, function (newFile) {

          String(newFile.contents).should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });


      it('should call function once for each replacement when replacing a regex on a buffer', function(done) {
        const stream = replacePlugin(/world/g, function() { return replacements.shift(); });

        check(stream, done, function (newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });

      it('should trigger events on a buffer', function(done) {
        const stream = replacePlugin('world', 'elephant')
        stream.on('finish', function() {
          // No assertion required, we should end up here, if we don't the test will time out
          done();
        });

        stream.write(file);
        stream.end();
      });
    });

    describe('streamed input', function () {
      let file, check;

      beforeEach(function () {
        file = new File({
          base: 'test/fixtures/',
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

      it('should have this.file set to the vinyl file object', function(done) {
        const stream = replacePlugin('world', function() {
          this.file.should.equal(file);
          return 'person';
        });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should have this.file set to the vinyl file object for regex replaces', function(done) {
        const stream = replacePlugin(/world/g, function() {
          this.file.should.equal(file);
          return 'person';
        });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace filenames', function(done) {
        const stream = replacePlugin('world', function() {
          return this.file.relative;
        });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/hellofilename.txt', 'utf8'));
        });
      });

      it('should replace string on a stream', function(done) {
        const stream = replacePlugin('world', 'person');
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a stream', function(done) {
        const stream = replacePlugin(/world/g, 'person');
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace regex on a stream with a function', function(done) {
        const stream = replacePlugin(/world/g, function() { return 'person'; });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should replace string on a stream with a function', function(done) {
        const stream = replacePlugin('world', function() { return 'person'; });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        });
      });

      it('should call function once for each replacement when replacing a string on a stream', function(done) {
        const stream = replacePlugin('world', function() { return replacements.shift(); });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });

      it('should call function once for each replacement when replacing a regex on a stream', function(done) {
        const stream = replacePlugin(/world/g, function() { return replacements.shift(); });
        check(stream, done, function (data) {
          data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        });
      });
    });

    describe('options', function () {
      describe('skipBinary', function () {
        let stream;

        beforeEach(function () {
          stream = replacePlugin('world', 'person', {skipBinary: true});
        });

        it('should ignore binary files when skipBinary is enabled', function(done) {
          const file = new File({
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
          const file = new File({
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

        it('should be true by default', function(done) {
          stream = replacePlugin('world', 'person');

          const file = new File({
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

      });
    });
  });
});
