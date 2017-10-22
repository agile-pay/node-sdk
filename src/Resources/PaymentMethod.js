'use strict';

const { internal } = require('../utils');
const { PaginatedResponse } = require('../Response');

/**
 * @typedef {Object} PaymentMethod
 *
 * Agile Pay PaymentMethod
 */
module.exports = class PaymentMethod {

  /**
   * AgilePay PaymentMethod
   *
   * @param {Object} client
   * @param {String} token
   */
  constructor(client, token = '') {
    internal(this).client = client;
    internal(this).token = token;
    internal(this).options = { 'keep': false };
  }

  /**
   * asserts whether the payment method will be permanently stored in AgilePay
   * @param {Boolean} val
   * @return $this
   */
  keep(val = true) {
    internal(this).options['keep'] = val;
    return this;
  };

  /**
   * Retrieve the payment method details
   * @return {Promise.<Object>} response
   */
  get() {
    return internal(this).client.get(`payment-method/${internal(this).token}`);
  };

  /**
   * Retrieve the payment methods list
   * @param {Object} options
   * @return {Promise.<Object>} response
   */
  getList(options) {
    const response = internal(this).client.get('payment-methods', { 'params': options });

    return new PaginatedResponse(internal(this).client, response);
  };

  /**
   * Creates a new payment method type of card
   * @param {Object} data
   * @return {Promise.<Object>} response
   */
  createCard(data) {
    return internal(this).client.post('payment-methods',
      {
        'data': {
          'type': 'card',
          'details': data,
          'options': Object.assign({}, internal(this).options),
        },
      });
  };

  /**
   *
   * @param {String} gateway
   * @param {Object} card
   * @return {Promise.<Object>} response
   */
  createGatewayToken(gateway, card) {
    const details = { 'gateway': gateway };
    if (card) {
      details['card'] = card;
    } else {
      details['payment_method'] = internal(this).token;
    }

    return internal(this).client.post('payment-methods',
      {
        'data': {
          'type': 'gateway_token',
          'details': Object.assign({}, details),
          'options': Object.assign({}, internal(this).options),
        },
      }
    );
  };

};
