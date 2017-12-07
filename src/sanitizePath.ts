import * as restify from 'restify';

function strip(path) {
    let cur;
    let next;
    let str = '';

    for (let i = 0; i < path.length; i++) {
        cur = path.charAt(i);

        if (i !== path.length - 1) {
            next = path.charAt(i + 1);
        }

        if (cur === '/' && (next === '/' || (next === '?' && i > 0))) {
            continue;
        }

        str += cur;
    }

    return str;
}

export function sanitizePath() {
    function _sanitizePath(req, res, next) {
        req.url = strip(req.url);
        next();
    }

    return _sanitizePath;
}
