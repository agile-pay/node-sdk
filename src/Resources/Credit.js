'use strict';

const { internal } = require('../utils');

/**
 * @typedef {Object} Credit
 * AgilePay credit
 */
module.exports = class Credit {

  /**
   * AgilePay credit
   *
   * @param {Object} client
   */
  constructor(client) {
    internal(this).client = client;
  };

  /**
   * Retrieves the user credit information
   * @return {Promise.<Object>} response object
   */
  get() { return internal(this).client.get('credit'); };

  /**
   * Top up the user credit amount
   *
   * @param {Number} amount
   * @param {String/Object} card
   * @param {Object} billing
   */
  topUp(amount, card, billing) {
    const data = { 'amount': amount, 'billing': billing };
    data[typeof card === 'string' ? 'payment_method' : 'card'] = card;

    return internal(this).client.put('credit', { 'data': Object.assign({}, data) });
  };

};
