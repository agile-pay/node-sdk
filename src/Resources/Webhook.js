'use strict';

const { createHmac } = require('crypto');
const { internal, bufferEq } = require('../utils');

/**
 * @typedef {Object} Webhook
 * AgilePay Webhook
 */
module.exports = class Webhook {

  constructor(client, reference = null) {
    internal(this).client = client;
    internal(this).reference = reference;
  }

  /**
   * Sets the Webhook reference
   *
   * @param {Object} reference
   * @returns {Object} this
   */
  setReference(reference) {
    internal(this).reference = reference;
    return this;
  };

  /**
   * Creates a Webhook
   *
   * @param {String} url
   * @param {Object} options
   * @returns {Promise.<Object>} response
   */
  create(url, options = {}) {
    return internal(this).client.post('webhooks', { 'data': Object.assign({}, url, options) });
  }

  /**
   * Update an existing webhook
   *
   * @param {Object} data
   * @returns {Promise.<Object>} response
   */
  update(data) {
    return internal(this).client.put(`webhooks/${internal(this).reference}`, { 'data': data });
  }

  /**
   * Verifies whether the provided signature from a webhook request is valid
   *
   * @param {Object/Buffer} signature The X-Agilepay-Signature
   * @param {Object} body The webhook request's body
   * @returns {Boolean}
   */
  verifySignature(signature, body) {
    const secret = internal(this).client.getConfig()['api_secret'];
    const signed = createHmac('sha256', secret).update(Buffer.from(body).toString('base64')).digest('hex');

    // bufferEq compares buffers in constant time
    return signed === signature && bufferEq(Buffer.from(signed), Buffer.from(signature));
  };

};
