import replacePlugin = require('../..');

replacePlugin(/.*/, '');
replacePlugin('hello', 'world');

replacePlugin(/.*/, () => 'test');
replacePlugin('', (match, ...args) => match + '-test' + args[0]);
