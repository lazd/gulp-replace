'use strict';

const replacePlugin = require('../');
const { spawnSync } = require('child_process');
const fs = require('fs');
const npmWhich = require('npm-which');
const { join } = require('path');
const should = require('should');
const File = require('vinyl');

describe('gulp-replace', function() {
  describe('real world use cases', function() {
    it('drop use strict on a buffer', function(done) {
      const file = new File({
        path: 'test/fixtures/strict.js',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/strict.js')
      });

      const stream = replacePlugin(/\s*(('use strict')|("use strict"));?/g, '');
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
      const file = new File({
        path: 'test/fixtures/scriptpage.html',
        cwd: 'test/',
        base: 'test/fixtures',
        contents: fs.readFileSync('test/fixtures/scriptpage.html')
      });

      const versions = {
        'jquery': '2.1.1',
        'react': '0.10.0'
      };

      function replaceByVersion(match, packageName, offset, string) {
        const version = versions[packageName];
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

      const stream = replacePlugin(/-@@(.*?)Ver/g, replaceByVersion);
      stream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.contents);

        String(newFile.contents).should.equal(fs.readFileSync('test/expected/scriptpage.html', 'utf8'));
        done();
      });

      stream.write(file);
      stream.end();
    });

    it('run `gulp-replace` using typescript', function() {
      this.slow(5 * 1000);
      this.timeout(10 * 1000);

      const spawnResult = spawnSync(
        npmWhich(__dirname).sync('ts-node'),
        [
          join(__dirname, 'fixtures', 'script.ts')
        ]);

      should.equal(spawnResult.status, 0);
    });
  });
});
