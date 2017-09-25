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
   *
   * @param {Object} reference
   * @return {Object} this
   */
  setReference(reference) {
    internal(this).reference = reference;
    return this;
  };

  /**
   *
   * @param {String} url
   * @param {Object} options
   * @return {Promise.<Object>} response
   */
  create(url, options = {}) {
    return internal(this).client.post('webhooks', { 'data': Object.assign({}, url, options) });
  }

  /**
   * Update an existing webhook
   * @param {Object} data
   * @return {Promise.<Object>} response
   */
  update(data) {
    return internal(this).client.put(`webhook/${internal(this).reference}/update`, { 'data': data });
  }

  /**
   * Verifies whether the provided signature from a webhook request is valid
   *
   * @param {Object/Buffer} signature The X-Agilepay-Signature
   * @param {Object} body The webhook request's body
   * @return {Boolean}
   */
  verifySignature(signature, body) {
    const secret = internal(this).client.getConfig()['api_secret'];
    const signed = createHmac('sha256', secret).update(Buffer.from(body).toString('base64')).digest('hex');

    // bufferEq compares buffers in constant time
    return signed === signature && bufferEq(Buffer.from(signed), Buffer.from(signature));
  };

};
