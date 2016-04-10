'use strict';
var stream = require('stream');

function isReadableStream(obj) {
  return (typeof obj._read === 'function') &&
    (typeof obj._readableState === 'object');
}

module.exports = (stream, timeout) => {
    var buffer = [];

    return new Promise((resolve, reject) => {
        if (typeof stream.on !== 'function' || typeof stream.pipe !== 'function' || !isReadableStream(stream)) {
            reject(new Error('Not an readable stream'));
        }

        stream.on('data', x => {
            if (Buffer.isBuffer(x)) {
                buffer.push(x.toString());
            } else {
                buffer.push(x);
            }
        });
        stream.on('error', e => {
            reject(e);
        });

        stream.on('end', () => {
            resolve(buffer);
        });

        if (typeof timeout === 'number') {
            setTimeout(function () {
                reject(new Error('Timout exceeded: ' + timeout));
            }, timeout);
        }
    });
};
