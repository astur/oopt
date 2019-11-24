const test = require('ava');
const oopt = require('.');
const arrgv = require('arrgv');

test('errors', t => {
    t.throws(
        () => { oopt(1); },
        Error,
        'optstring must be a string',
    );

    t.throws(
        () => { oopt(); },
        Error,
        'optstring is required arg',
    );

    t.throws(
        () => { oopt('', 1); },
        Error,
        'args must be an array',
    );

    t.throws(
        () => { oopt('', [1]); },
        Error,
        'every arg must be a string',
    );

    t.throws(
        () => { oopt('aa'); },
        Error,
        'repeating options are not allowed',
    );

    t.throws(
        () => { oopt(':abc'); },
        Error,
        'first char of optstring must be alnum',
    );

    t.throws(
        () => { oopt('_'); },
        Error,
        'only alnums and colons allowed in optstring',
    );

    t.throws(
        () => { oopt('a::b'); },
        Error,
        'double colons are not allowed',
    );

    t.throws(
        () => { oopt('abcWdef'); },
        Error,
        'key "-W" is reserved',
    );
});

test('options', t => {
    t.deepEqual(
        oopt('', []),
        {},
        'empty optstring and empty args',
    );

    t.deepEqual(
        oopt('a', []),
        {a: false},
        'small letter in optstring',
    );

    t.deepEqual(
        oopt('A', []),
        {A: false},
        'capital letter in optstring',
    );

    t.deepEqual(
        oopt('1', []),
        {1: false},
        'digit in optstring',
    );

    t.deepEqual(
        oopt('a:1:', []),
        {a: '', 1: ''},
        'options with arguments',
    );
});

test('values', t => {
    t.deepEqual(
        oopt('a', arrgv('-a')),
        {a: true},
        'single option',
    );

    t.deepEqual(
        oopt('a', arrgv('"-a"')),
        {a: true},
        'quoted single option',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b arg')),
        {a: true, b: 'arg', c: false},
        'options with no operands',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('--')),
        {a: false, b: '', c: false, _: []},
        '-- is no option',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-ab arg p1 p2')),
        {a: true, b: 'arg', c: false, _: ['p1', 'p2']},
        'grouped options with argument and operands',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b arg p1 p2')),
        {a: true, b: 'arg', c: false, _: ['p1', 'p2']},
        'separate options with argument and operands',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-b arg -a p1 p2')),
        {a: true, b: 'arg', c: false, _: ['p1', 'p2']},
        'options order does not matter',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -barg p1 p2')),
        {a: true, b: 'arg', c: false, _: ['p1', 'p2']},
        'argument joined with option',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-abarg p1 p2')),
        {a: true, b: 'arg', c: false, _: ['p1', 'p2']},
        'argument joined with group options',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b arg -- -c p1 -p2')),
        {a: true, b: 'arg', c: false, _: ['-c', 'p1', '-p2']},
        'everything after "--" there is operands',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-a -b "a r g" "p1 p2"')),
        {a: true, b: 'a r g', c: false, _: ['p1 p2']},
        'multiword operands and argument',
    );

    t.deepEqual(
        oopt('a:b:', arrgv('-a "" -b \'\'')),
        {a: '', b: ''},
        'empty strings is correct arguments',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('-b -a')),
        {a: false, b: '-a', c: false},
        'no optional arguments',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('"-a -b"')),
        {a: false, b: '', c: false, _: ['-a -b']},
        'no multiword options',
    );

    t.deepEqual(
        oopt('ab:c', arrgv('p1 p2 -a -b arg')),
        {a: false, b: '', c: false, _: ['p1', 'p2', '-a', '-b', 'arg']},
        'operands before options',
    );

    t.throws(
        () => { oopt('ab:c', arrgv('-a -b')); },
        Error,
        'all arguments are mandatory',
    );

    t.throws(
        () => { oopt('ab:c', arrgv('-d')); },
        Error,
        'illegal option',
    );
});
