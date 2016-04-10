'use strict';
let should = require('should-promised');
let streamify = require('stream-array');
let stream = require('stream');

let buffer = require('../../src/buffer');

describe('#buffer', (x) => {
    it('should reject with an error when input is not a stream', () => {
        return buffer(function () {}).should.be.rejected();
    });

    //[TODO]
    it('should reject with an error when input is not a readable stream', () => {
        var writable = new stream.Writable(),
            promise = buffer(writable);

        return promise.should.be.rejected();
    });

    it('should throw an error when timeout exceeded', () => {
        var writable = new stream.Writable(),
            promise = buffer(writable, 100); //100ms

        return promise.should.be.rejected();
    });

    it('should handle an error in the stream', () => {
        var readable = new stream.Readable(),
            promise = buffer(readable);

        readable.emit('error', 'test');
        readable.emit('end');

        return promise.should.be.rejected();
    });

    it('should buffer data to a string', () => {
        return buffer(streamify([
            'a',
            'b',
            'c'
        ])).should.be.eventually.eql(['a', 'b' , 'c']);
    });
});
