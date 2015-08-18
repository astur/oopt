# Oopt

Parsing commanl-line arguments in style of old good [getopt](http://pubs.opengroup.org/onlinepubs/9699919799/functions/getopt.html) with no extras. For geeks and minimalists only. Only configuration is standart `optstring` (something like '`ab:c`') and result is an object with 'options', 'arguments' and 'operands'.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

If no bugs, it ought to be pure getopt, that is described in [The Open Group Base Specifications Issue 7](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/contents.html) (aka IEEE Std 1003.1, 2013 Edition):

> The getopt() function is a command-line parser that shall follow Utility Syntax Guidelines 3, 4, 5, 6, 7, 9, and 10 in XBD [Utility Syntax Guidelines](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_02).

Main intention was to make utility, which passed tests, that describe those XBD Utility Syntax Guidelines:

> **Guideline 3:**
Each option name should be a single alphanumeric character (the alnum character classification) from the portable character set. The -W (capital-W) option shall be reserved for vendor options. Multi-digit options should not be allowed.

> **Guideline 4:**
All options should be preceded by the '-' delimiter character.

> **Guideline 5:**
One or more options without option-arguments, followed by at most one option that takes an option-argument, should be accepted when grouped behind one '-' delimiter.

> **Guideline 6:**
Each option and option-argument should be a separate argument, except as noted in [Utility Argument Syntax, item (2)](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_01).

> **Guideline 7:**
Option-arguments should not be optional.

> **Guideline 9:**
All options should precede operands on the command line.

> **Guideline 10:**
The first -- argument that is not an option-argument should be accepted as a delimiter indicating the end of options. Any following arguments should be treated as operands, even if they begin with the '-' character.

If something in `oopt` works not like in Guidelines - that's a bug. Feel free to make issue or pull request.

## Install

```bash
npm install oopt
```

## Tests

```bash
$ npm test
```

## Example

```js
//app.js
var oopt = require('oopt');
console.log(oopt('ab:c'));
```
----
```bash
$ node app.js
{ a: false, b: '', c: false}
$ node app.js -a -b arg
{ a: true, b: 'arg', c: false }
$ node app.js --
{ a: false, b: '', c: false, _: [] }
$ node app.js -ab arg p1 p2
{ a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] }
$ node app.js -a -b arg p1 p2
{ a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] }
$ node app.js -b arg -a p1 p2
{ a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] }
$ node app.js -a -barg p1 p2
{ a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] }
$ node app.js -abarg p1 p2
{ a: true, b: 'arg', c: false, _: [ 'p1', 'p2' ] }
$ node app.js -a -b arg -- -c p1 -p2
{ a: true, b: 'arg', c: false, _: [ '-c', 'p1', '-p2' ] }
$ node app.js -a -b "a r g" "p1 p2"
{ a: true, b: 'a r g', c: false, _: [ 'p1 p2' ] }
$ node app.js -b -a
{ a: false, b: '-a', c: false }
$ node app.js "-a -b"
{ a: false, b: '', c: false, _: [ '-a -b' ] }
$ node app.js p1 p2 -a -b arg
{ a: false, b: '', c: false, _: [ 'p1', 'p2', '-a', '-b', 'arg' ] }
```

More examples in tests.

## License

MIT

[travis-url]: https://travis-ci.org/astur/oopt
[travis-image]: https://travis-ci.org/astur/oopt.svg?branch=master
[npm-url]: https://npmjs.org/package/oopt
[npm-image]: https://img.shields.io/npm/v/oopt.svg