var replacePlugin = require('../');
var fs = require('fs');
var path = require('path');
var es = require('event-stream');
var should = require('should');
var gutil = require('gulp-util');
require('mocha');

describe('gulp-replace', function() {
  describe('real world use cases', function() {
    it('drop use strict on a buffer', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/strict.js',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/strict.js')
      });

      var stream = replacePlugin(/\s*(('use strict')|("use strict"));?/g, '');
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/strict.js', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('replace script versions in HTML', function(done) {
      var file = new gutil.File({
        path: 'test/fixtures/scriptpage.html',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/scriptpage.html')
      });

      var versions = {
        'jquery': '2.1.1',
        'react': '0.10.0'
      };

      function replaceByVersion(match, packageName, offset, string) {
        var version = versions[packageName];
        // @todo Read in actual installed version of package
        // It will not match when using jquery: ^2.1.1 in package.json

        if (version) {
          return '-'+version;
        }
        else {
          // console.warn('No matching dependency version found for %s', packageName);
          return '';
        }
      }

      var stream = replacePlugin(/-@@(.*?)Ver/g, replaceByVersion);
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/scriptpage.html', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });
  });
});
