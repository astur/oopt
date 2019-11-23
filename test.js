const test = require('ava');
const oopt = require('.');
const arrgv = require('arrgv');

test('errors', t => {
    t.throws(
        () => { oopt(1); },
        Error,
        'optstring must be a string'
    );

    t.throws(
        () => { oopt(); },
        Error,
        'optstring is required arg'
    );

    t.throws(
        () => { oopt('', 1); },
        Error,
        'args must be an array'
    );

    t.throws(
        () => { oopt('', [1]); },
        Error,
        'every arg must be a string'
    );

    t.throws(
        () => { oopt('aa'); },
        Error,
        'repeating options are not allowed'
    );

    t.throws(
        () => { oopt(':abc'); },
        Error,
        'first char of optstring must be alnum'
    );

    t.throws(
        () => { oopt('_'); },
        Error,
        'only alnums and colons allowed in optstring'
    );

    t.throws(
        () => { oopt('a::b'); },
        Error,
        'double colons are not allowed'
    );

    t.throws(
        () => { oopt('abcWdef'); },
        Error,
        'key "-W" is reserved'
    );
});

test('options', t => {
    t.deepEqual(
        oopt('', []),
        {},
        'empty optstring and empty args'
    );

    t.deepEqual(
        oopt('a', []),
        {a: 0},
        'small letter in optstring'
    );

    t.deepEqual(
        oopt('A', []),
        {A: 0},
        'capital letter in optstring'
    );

    t.deepEqual(
        oopt('1', []),
        {1: 0},
        'digit in optstring'
    );

    t.deepEqual(
        oopt('a:1:', []),
        {a: '', 1: '', _a: [], _1: []},
        'options with arguments'
    );
});

test('values', t => {
    t.deepEqual(
        oopt('a', arrgv('-a')),
        {a: 1},
        'single option'
    );

    t.deepEqual(
        oopt('a', arrgv('-a -a')),
        {a: 2},
        'single option multiple invocations'
    );

    t.deepEqual(
        oopt('a', arrgv('-aa')),
        {a: 2},
        'single option multiple invocations grouped'
    );

    t.deepEqual(
        oopt('a', arrgv('"-a"')),
        {a: 1},
        'quoted single option'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b arg')),
        {a: 1, b: 'arg', c: 0, _b: ['arg']},
        'options with no operands'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('--')),
        {a: 0, b: '', c: 0, _b: [], _: []},
        '-- is no option'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-ab arg p1 p2')),
        {a: 1, b: 'arg', c: 0, _b: ['arg'], _: ['p1', 'p2']},
        'grouped options with argument and operands'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b arg p1 p2')),
        {a: 1, b: 'arg', c: 0, _b: ['arg'], _: ['p1', 'p2']},
        'separate options with argument and operands'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-b arg -a p1 p2')),
        {a: 1, b: 'arg', c: 0, _b: ['arg'], _: ['p1', 'p2']},
        'options order does not matter'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -barg p1 p2')),
        {a: 1, b: 'arg', c: 0, _b: ['arg'], _: ['p1', 'p2']},
        'argument joined with option'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-abarg p1 p2')),
        {a: 1, b: 'arg', c: 0, _b: ['arg'], _: ['p1', 'p2']},
        'argument joined with group options'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b arg -- -c p1 -p2')),
        {a: 1, b: 'arg', c: 0, _b: ['arg'], _: ['-c', 'p1', '-p2']},
        'everything after "--" there is operands'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b "a r g" "p1 p2"')),
        {a: 1, b: 'a r g', c: 0, _b: ['a r g'], _: ['p1 p2']},
        'multiword operands and argument'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b a -b r -b g "p1 p2"')),
        {a: 1, b: 'g', c: 0, _b: ['a', 'r', 'g'], _: ['p1 p2']},
        'multiple invocations of one option with different arguments'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-b -a')),
        {a: 0, b: '-a', c: 0, _b: ['-a']},
        'no optional arguments'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('"-a -b"')),
        {a: 0, b: '', c: 0, _b: [], _: ['-a -b']},
        'no multiword options'
    );

    t.deepEqual(
        oopt('ab:c', arrgv('p1 p2 -a -b arg')),
        {a: 0, b: '', c: 0, _b: [], _: ['p1', 'p2', '-a', '-b', 'arg']},
        'operands before options'
    );

    t.throws(
        () => { oopt('ab:c', arrgv('-a -b')); },
        Error,
        'all arguments are mandatory'
    );

    t.throws(
        () => { oopt('ab:c', arrgv('-d')); },
        Error,
        'illegal option'
    );
});
