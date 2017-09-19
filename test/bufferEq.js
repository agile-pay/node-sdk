'use strict';

const { bufferEq } = require('../src/utils');
const assert = require('assert');

describe('buffer-equal-constant-time', () => {
  const a = Buffer.from('asdfasdf123456');
  const b = Buffer.from('asdfasdf123456');
  const c = Buffer.from('asdfasdf');

  describe('bufferEq', () => {
    it('says a == b', () => {
      assert.strictEqual(bufferEq(a, b), true);
    });

    it('says a != c', () => {
      assert.strictEqual(bufferEq(a, c), false);
    });
  });

  describe('install/restore', () => {
    before(() => {
      bufferEq.install();
    });
    after(() => {
      bufferEq.restore();
    });

    it('installed an .equal method', () => {
      const SlowBuffer = require('buffer').Buffer.allocUnsafeSlow;
      assert.ok(Buffer.prototype.equal);
      assert.ok(SlowBuffer.prototype.equal);
    });

    it('infected existing Buffers', () => {
      assert.strictEqual(a.toString(), b.toString());
      assert.notEqual(a.equal(c), false);
    });
  });

});
