module.exports = function(optstring, args){

    if (typeof optstring !== 'string') {
        throw new Error('optstring must be a String');
    }

    if (/[^a-zA-Z0-9:]/.test(optstring)) {
        throw new Error('only alnums and colons allowed in optstring');
    }

    if (optstring[0] === ':') {
        throw new Error('first char of optstring must be alnum');
    }

    if (/W/.test(optstring)) {
        throw new Error('option "-W" is reserved');
    }

    if (/::/.test(optstring)) {
        throw new Error('double colons are not allowed');
    }

    if (/([a-zA-Z0-9])(.*)\1/.test(optstring)) {
        throw new Error('repeating options are not allowed');
    }

    if (args === undefined) {
        args = process.argv.slice(2);
    } else if (!Array.isArray(args)) {
        throw new Error();
    }

    var res = {},
        i, l, a, c;

    for (i = 0, l = optstring.length; i < l; i++) {
        if (optstring[i + 1] === ':') {
            res[optstring[i]] = '';
            i++;
        } else {
            res[optstring[i]] = false;
        }
    }

    for (i = 0, l = args.length; i < l; i++) {
        a = args[i];
        if (a === '--') {
            res._ = args.slice(i+1);
            return res;
        }

        if (!/^-/.test(a) || /\s/.test(a)) {
            res._ = args.slice(i);
            return res;
        }

        a = args[i].split('').slice(1);
        while ( ( c = a.shift() ) !== undefined ) {
            switch (typeof res[c]) {
            case 'undefined':
                throw new Error('illegal option -- ' + c);
            case 'boolean':
                res[c] = true;
                continue;
            case 'string':
                if (a.length > 0) {
                    res[c] = a.join('');
                    a = [];
                    break;
                } else if (args[i + 1] !== undefined) {
                    res[c] = args[i + 1];
                    i++;
                    break;
                } else {
                    throw new Error('option ' + c + ' needs argument');
                }
            }
        }
    }

    return res;
};