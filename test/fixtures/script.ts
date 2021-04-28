import replacePlugin = require('../..');

replacePlugin(/.*/, '');
replacePlugin('hello', 'world');

replacePlugin(/.*/, () => 'test');
replacePlugin('', (match, ...args) => match + '-test' + args[0]);

replacePlugin(
    '',
    function (match)
    {
        console.log(match);
        console.log(this.file.basename);
        return '';
    })
