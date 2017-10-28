'use strict';

const { internal } = require('../utils');

/**
 * @typedef {Object} ClientToken
 * AgilePay ClientToken
 */
module.exports = class ClientToken {

  /**
   * AgilePay ClientToken
   * @param {Object} client
   */
  constructor(client) {
    internal(this).client = client;
  }

  /**
   * Generates a new client token
   *
   * @param {Object} ip
   * @returns {Object} response
   */
  generate(ip = null) {
    if (ip == null) {
      ip = internal(this).client.defaults.headers.common['x-forwarded-for'] ||
           internal(this).client.defaults.headers.common['Auth-Token'] ||
           internal(this).client.defaults.headers.common['Authorization'] ||
           internal(this).client.defaults.connection.remoteAddress;
    };

    return internal(this).client.post('client-tokens', { 'data': { 'client_ip': ip } });
  }

};
