module.exports = (optstring, args = process.argv.slice(2)) => {
    if(!Array.isArray(args)) throw new Error('arguments must be an Array');
    if(!args.every(a => typeof a === 'string')) throw new Error('every argument must be a String');

    if(typeof optstring !== 'string') throw new Error('optstring must be a String');
    if(/[^a-zA-Z0-9:]/.test(optstring)) throw new Error('only alnums and colons allowed in optstring');
    if(optstring[0] === ':') throw new Error('first char of optstring must be alnum');
    if(/W/.test(optstring)) throw new Error('option "-W" is resulterved');
    if(/::/.test(optstring)) throw new Error('double colons are not allowed');
    if(/([a-zA-Z0-9])(.*)\1/.test(optstring)) throw new Error('repeating options are not allowed');

    const result = {};

    for(let i = 0, l = optstring.length; i < l; i++){
        if(optstring[i + 1] === ':'){
            result[optstring[i]] = '';
            i++;
        } else {
            result[optstring[i]] = 0;
        }
    }

    for(let i = 0, l = args.length; i < l; i++){
        if(args[i] === '--'){
            result._ = args.slice(i + 1);
            return result;
        }

        if(!args[i].startsWith('-') || /\s/.test(args[i])){
            result._ = args.slice(i);
            return result;
        }

        const opts = args[i].split('').slice(1);

        let c = opts.shift();
        while(c !== undefined){
            if(typeof result[c] === 'undefined') throw new Error(`illegal option -- ${c}`);
            if(typeof result[c] === 'number') result[c]++;
            if(typeof result[c] === 'string'){
                if(opts.length > 0){
                    result[c] = opts.join('');
                    break;
                } else if(args[i + 1] === undefined){
                    throw new Error(`option ${c} needs argument`);
                } else {
                    result[c] = args[i + 1];
                    i++;
                }
            }
            c = opts.shift();
        }
    }

    return result;
};
