'use strict';

const Buffer = require('buffer').Buffer;
const SlowBuffer = Buffer.allocUnsafeSlow;
const { Writable } = require('stream');

const _private = new WeakMap();
const internal = object => {
  if (!_private.has(object)) { _private.set(object, {}); };
  return _private.get(object);
};

const bufferEq = (a, b) => {

  // shortcutting on type is necessary for correctness
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) { return false; };

  // buffer sizes should be well-known information, so despite this
  // shortcutting, it doesn't leak any information about the *contents* of the
  // buffers.
  if (a.length !== b.length) { return false; }

  let c = 0;
  for (let i = 0; i < a.length; i++) {
    /* bitwise:false */
    c |= a[i] ^ b[i]; // XOR
  }
  return c === 0;
};

bufferEq.install = () => { Buffer.prototype.equal = SlowBuffer.prototype.equal = that => { bufferEq(this, that); }; };

const origBufEqual = Buffer.prototype.equal;
const origSlowBufEqual = SlowBuffer.prototype.equal;
bufferEq.restore = () => {
  Buffer.prototype.equal = origBufEqual;
  SlowBuffer.prototype.equal = origSlowBufEqual;
};


module.exports = { internal, bufferEq };
