'use strict';

const { internal } = require('../utils');
const { PaginatedResponse } = require('../Response');

/**
 * @typedef {Object} Gateway
 * AgilePay gateway
 */
module.exports = class Gateway {

  /**
   * AgilePay gateway
   *
   * @param {Object} client
   * @param {String} reference
   */
  constructor(client, reference = null) {
    internal(this).client = client;
    internal(this).reference = reference;
  }

  /**
   * Get a Gateway
   *
   * @returns {Promise.<Object>} AgilePay Client response
   */
  get() { return internal(this).client.get(`gateways/${internal(this).reference}`); }

  /**
   * Retrieve the list of gateways owned by the user
   *
   * @param {Object} options
   * @returns {Promise.<Object>} AgilePay Client response
   */
  getList(options) {

    const response = internal(this).client.get('gateways', { 'params': options });

    return new PaginatedResponse(internal(this).client, response);
  };

  /**
   * Set the transaction reference
   *
   * @param {String} reference
   * @returns {Gateway}
   */
  setReference(reference) {
    internal(this).reference = reference;
    return this;
  }

  /**
   * Creates a new gateway
   *
   * @param {String} type
   * @param {Object} fields
   * @return {Object} client post return
   */
  create(type, fields = {}) {
    return internal(this).client.post('gateways', {
      'data': { 'type': type, 'fields': fields },
    });
  };

  /**
   * Update an existing gateway
   *
   * @param {Object} fields
   * @return {Object} client put return
   */
  update(body) {
    return internal(this).client.put(`gateways/${internal(this).reference}`, { 'data': body });
  }

};
