var tape = require('tape');
var oopt = require('../');
var arrgv = require('arrgv');

tape.test('base', function (t) {

    t.ok(typeof oopt === 'function', 'is Function');

    t.same(oopt('', []), 
        {}, 
        'empty optstring and empty args');

    t.end();
});

tape.test('errors', function (t) {

    t.throws(function(){oopt(1);},
        Error,
        'optstring must be a string');

    t.throws(function(){oopt();},
        Error,
        'optstring is required arg');

    t.throws(function(){oopt('', 1);},
        Error,
        'args must be an array');

    t.throws(function(){oopt('aa');},
        Error,
        'repeating options are not allowed');

    t.throws(function(){oopt(':abc');},
        Error,
        'first char of optstring must be alnum');

    t.throws(function(){oopt('_');},
        Error,
        'only alnums and colons allowed in optstring');

    t.throws(function(){oopt('a::b');},
        Error,
        'double colons are not allowed');

    t.throws(function(){oopt('abcWdef');},
        Error,
        'key "-W" is reserved');

    t.end();
});

tape.test('options', function (t) {

    t.same(oopt('a', []), 
        {a: false}, 
        'small letter in optstring');

    t.same(oopt('A', []), 
        {A: false}, 
        'capital letter in optstring');

    t.same(oopt('1', []), 
        {'1': false}, 
        'digit in optstring');

    t.same(oopt('a:1:', []), 
        {a: '', '1': ''}, 
        'options with arguments');

    t.end();
});

tape.test('values', function (t) {

    t.same(oopt('a', arrgv('-a')),
        {a: true},
        'single option');

    t.same(oopt('a', arrgv('"-a"')),
        {a: true},
        'quoted single option');

    t.same(oopt('ab:c', arrgv('-a -b arg')),
        { a: true, b: 'arg', c: false },
        'options with no operands');

    t.same(oopt('ab:c', arrgv('--')),
        { a: false, b: '', c: false, _: [] },
        '-- is no option');

    t.same(oopt('ab:c', arrgv('-ab arg p1 p2')),
        { a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] },
        'grouped options with argument and operands');

    t.same(oopt('ab:c', arrgv('-a -b arg p1 p2')),
        { a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] },
        'separate options with argument and operands');

    t.same(oopt('ab:c', arrgv('-b arg -a p1 p2')),
        { a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] },
        'options order does not matter');

    t.same(oopt('ab:c', arrgv('-a -barg p1 p2')),
        { a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] },
        'argument joined with option');

    t.same(oopt('ab:c', arrgv('-abarg p1 p2')),
        { a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] },
        'argument joined with group options');

    t.same(oopt('ab:c', arrgv('-a -b arg -- -c p1 -p2')),
        { a: true, b: 'arg', c: false, _: [ '-c', 'p1', '-p2' ] },
        'everything after "--" there is operands');

    t.same(oopt('ab:c', arrgv('-a -b "a r g" "p1 p2"')),
        { a: true, b: 'a r g', c: false, _: [ 'p1 p2' ] },
        'multiword operands and argument');

    t.same(oopt('ab:c', arrgv('-b -a')),
        { a: false, b: '-a', c: false },
        'no optional arguments');

    t.same(oopt('ab:c', arrgv('"-a -b"')),
        { a: false, b: '', c: false, _: [ '-a -b' ] },
        'no multiword options');

    t.same(oopt('ab:c', arrgv('p1 p2 -a -b arg')),
        { a: false, b: '', c: false, _: [ 'p1', 'p2', '-a', '-b', 'arg' ] },
        'operands before options');

    t.throws(function(){oopt('ab:c', arrgv('-a -b'));},
        Error,
        'all arguments are mandatory');

    t.throws(function(){oopt('ab:c', arrgv('-d'));},
        Error,
        'illegal option');

    t.end();
});