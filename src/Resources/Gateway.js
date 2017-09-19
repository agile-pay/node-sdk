'use strict';

const { internal } = require('../utils');

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
  update(fields) {
    return internal(this).client.put(`gateway/${internal(this).reference}/update`, { 'data': fields });
  }

  /**
   * Retrieves the gateways list
   *
   * @todo
   * @param {Object} options
   * @return {Object}
   */
  retrieve(options) {};

};
