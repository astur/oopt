var tape = require('tape');
var oopt = require('../');

tape.test('base', function (t) {

    t.ok(typeof oopt === 'function', 'is Function');

    t.end();
});