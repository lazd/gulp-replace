'use strict';

var concatStream = require('concat-stream');
var replacePlugin = require('../');
var fs = require('fs');
var should = require('should');
var File = require('vinyl');

describe('gulp-replace', function() {
  describe('replacePlugin()', function() {
    describe('buffered input', function () {
      var file;

      beforeEach(function () {
        file = new File({
          path: 'test/fixtures/helloworld.txt',
          cwd: 'test/',
          base: 'test/fixtures',
          contents: fs.readFileSync('test/fixtures/helloworld.txt')
        });
      });

      it('should replace string on a buffer', function(done) {
        var stream = replacePlugin('world', 'person');
        stream.on('data', function(newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
          done();
        });

        stream.write(file);
        stream.end();
      });

      it('should replace regex on a buffer', function(done) {
        var stream = replacePlugin(/world/g, 'person');
        stream.on('data', function(newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
          done();
        });

        stream.write(file);
        stream.end();
      });

      it('should replace regex on a buffer with a function', function(done) {
        var stream = replacePlugin(/world/g, function() { return 'person'; });
        stream.on('data', function(newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
          done();
        });

        stream.write(file);
        stream.end();
      });

      it('should replace string on a buffer with a function', function(done) {
        var stream = replacePlugin('world', function() { return 'person'; });
        stream.on('data', function(newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
          done();
        });

        stream.write(file);
        stream.end();
      });


      it('should call function once for each replacement when replacing a string on a buffer', function(done) {
        var replacements = [
          'cow',
          'chicken',
          'duck',
          'person'
        ];
        var stream = replacePlugin('world', function() { return replacements.shift(); });
        stream.on('data', function(newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
          done();
        });

        stream.write(file);
        stream.end();
      });


      it('should call function once for each replacement when replacing a regex on a buffer', function(done) {
        var replacements = [
          'cow',
          'chicken',
          'duck',
          'person'
        ];
        var stream = replacePlugin(/world/g, function() { return replacements.shift(); });
        stream.on('data', function(newFile) {
          String(newFile.contents).should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
          done();
        });

        stream.write(file);
        stream.end();
      });

      it('should trigger events on a buffer', function(done) {
        var stream = replacePlugin('world', 'elephant')
        .on('finish', function() {
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
            cwd: 'test/',
            base: 'test/fixtures',
            contents: fs.createReadStream('test/fixtures/helloworld.txt')
          });
      });

      it('should replace string on a stream', function(done) {
        var stream = replacePlugin('world', 'person');
        stream.on('data', function(newFile) {
          should.exist(newFile);
          should.exist(newFile.contents);

          newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
            data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
            done();
          }));
        });

        stream.write(file);
        stream.end();
      });

      it('should replace regex on a stream', function(done) {
        var stream = replacePlugin(/world/g, 'person');
        stream.on('data', function(newFile) {
          should.exist(newFile);
          should.exist(newFile.contents);

          newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
            data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
            done();
          }));
        });

        stream.write(file);
        stream.end();
      });

      it('should replace regex on a stream with a function', function(done) {
        var stream = replacePlugin(/world/g, function() { return 'person'; });
        stream.on('data', function(newFile) {
          should.exist(newFile);
          should.exist(newFile.contents);

          newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
            data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
            done();
          }));
        });

        stream.write(file);
        stream.end();
      });

      it('should replace string on a stream with a function', function(done) {
        var stream = replacePlugin('world', function() { return 'person'; });
        stream.on('data', function(newFile) {
          should.exist(newFile);
          should.exist(newFile.contents);

          newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
            data.should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
            done();
          }));
        });

        stream.write(file);
        stream.end();
      });

      it('should call function once for each replacement when replacing a string on a stream', function(done) {
        var replacements = [
          'cow',
          'chicken',
          'duck',
          'person'
        ];
        var stream = replacePlugin('world', function() { return replacements.shift(); });
        stream.on('data', function(newFile) {
          should.exist(newFile);
          should.exist(newFile.contents);

          newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
            data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
            done();
          }));
        });

        stream.write(file);
        stream.end();
      });

      it('should call function once for each replacement when replacing a regex on a stream', function(done) {
        var replacements = [
          'cow',
          'chicken',
          'duck',
          'person'
        ];
        var stream = replacePlugin(/world/g, function() { return replacements.shift(); });
        stream.on('data', function(newFile) {
          should.exist(newFile);
          should.exist(newFile.contents);

          newFile.contents.pipe(concatStream({encoding: 'string'}, function(data) {
            data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
            done();
          }));
        });

        stream.write(file);
        stream.end();
      });
    });

    it('should ignore binary files when skipBinary is enabled', function(done) {
      var file = new File({
        path: 'test/fixtures/binary.png',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/binary.png')
      });

      var stream = replacePlugin('world', 'person', {skipBinary: true});
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        newFile.contents.should.eql(fs.readFileSync('test/expected/binary.png'));
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should replace string on non binary files when skipBinary is enabled', function(done) {
      var file = new File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.createReadStream('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin('world', 'person', {skipBinary: true});
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

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
