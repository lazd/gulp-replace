var replacePlugin = require('../');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var should = require('should');
var gutil = require('gulp-util');
require('mocha');

describe('gulp-replace', function() {
  describe('replacePlugin()', function() {
    it('should replace string on a stream', function(done) {
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

    it('should replace string on a buffer', function(done) {
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

    it('should replace regex on a buffer', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin(/world/g, 'person');
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should error when searching with regex on a stream', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.createReadStream('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin(/world/, 'person');
      stream.on('data', function() {
        throw new Error('Stream should not have emitted data event');
      });
      stream.on('error', function(err) {
        should.exist(err);
        done();
      });
      stream.write(file);
      stream.end();
    });

    it('should replace string on a stream with a function', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.createReadStream('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin('world', function() { return 'person'; });
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

    it('should replace string on a buffer with a function', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin('world', function() { return 'person'; });
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/helloworld.txt', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should replace string on a stream with a function', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.createReadStream('test/fixtures/helloworld.txt')
      });

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

        newFile.contents.pipe(es.wait(function(err, data) {
          should.not.exist(err);
          data.should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
          done();
        }));
      });

      stream.write(file);
      stream.end();
    });

    it('should call function once for each replacement when replacing a string on a buffer', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

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

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/hellofarm.txt', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('should ignore binary files when skipBinary is enabled', function(done) {
      var file = new gutil.File({
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
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.createReadStream('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin('world', 'person', {skipBinary: true});
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

    it('should trigger events on a stream', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/helloworld.txt',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/helloworld.txt')
      });

      var stream = replacePlugin('world', 'elephant')
      .on('end', function() {
        // No assertion required, we should end up here, if we don't the test will time out 
        done();
      });

      stream.write(file);
      stream.end();
    });
  });
});
