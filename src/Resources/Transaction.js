'use strict';

const { internal } = require('../utils');
const _renderSecondStageUri = Symbol('secondStageUri');
const _renderFirstStageUri = Symbol('firstStageUri');

/**
 * @typedef {Object} Transaction
 * AgilePay Transaction
 */
module.exports = class Transaction {

  /**
   * AgilePay Transaction
   *
   * @param {Object} client
   * @param {String} reference
   */
  constructor(client, reference = '') {
    internal(this).client = client;
    internal(this).reference = reference;
    internal(this).gatewayReference = null;
    internal(this).paymentMethodToken = null;
  }

  /**
   * @return {Promise.<Object>} AgilePay Client response
   */
  get() { return internal(this).client.get(`transaction/${internal(this).reference}`);
  }

  /**
   * Retrieve the transaction list
   *
   * @param {Object} options
   * @return {Promise.<Object>} AgilePay Client response
   */
  getList(options) {
    return internal(this).client.get('transactions',
      {
        'params': Object.assign({}, {
          'gateway': internal(this).gatewayReference,
          'payment_method': internal(this).paymentMethodToken,
        }, options),
      }
    );
  };

  /**
   * Charge a credit card
   *
   * @param {String} amount
   * @param {String} currency
   * @param {Object} data
   * @return {Promise.<Object>} AgilePay Client response
   */
  auth(amount, currency, data) {
    return internal(this).client.post('transaction/auth',
      {
        'data': Object.assign({}, {
          'gateway': internal(this).gatewayReference,
          'payment_method': internal(this).paymentMethodToken,
          'amount': amount,
          'currency_code': currency.toLowerCase(),
        }, data),
      }
    );
  }

  /**
   * Voids a previously authorized transaction
   *
   * @return {Promise.<Object>} AgilePay Client response
   */
  void() {
    return internal(this).client.post(this[_renderSecondStageUri]('void'));
  }

  /**
   * Refund a settled transaction
   *
   * @param {Number} amount
   * @param {String} currency
   * @return {Promise.<Object>} AgilePay Client response
   */
  credit(amount, currency) {
    let data = {};
    let options = {};

    if (typeof amount !== 'undefined') data['amount'] = amount;
    if (typeof currency !== 'undefined') data['currency_code'] = currency;
    if (Object.keys(data).length > 0) options.data = data;

    return internal(this).client.post(this[_renderSecondStageUri]('credit'), options);
  }

  /**
   * Settle a previously authorized transaction
   *
   * @param {Number} amount
   * @param {String} currency
   * @return {Promise.<Object>} AgilePay Client response
   */
  capture(amount, currency) {
    let data = {};
    let options = {};

    if (typeof amount !== 'undefined') data['amount'] = amount;
    if (typeof currency !== 'undefined') data['currency_code'] = currency;
    if (Object.keys(data).length > 0) options.data = data;

    return internal(this).client.post(this[_renderSecondStageUri]('capture'), options);
  };

  /**
   * Set the transaction reference
   *
   * @param {String} reference
   * @return this
   */
  setReference(reference) {
    internal(this).reference = reference;
    return this;
  }

  /**
   * Set the gateway to use to perform the first stage transactions
   *
   * @param {String} reference
   * @return this
   */
  setGateway(reference) {
    internal(this).gatewayReference = reference;
    return this;
  }

  /**
   * Set the payment method to perform the first stage transactions
   *
   * @param token
   * @return this
   */
  setPaymentMethod(token) {
    internal(this).paymentMethodToken = token;
    return this;
  }

  /**
   * render the uri required to process second stage transactions
   *
   * @param {String} transactionType
   * @return {String}
   * @throws Error
   */
  [_renderSecondStageUri](transactionType) {
    if (!internal(this).reference) throw new Error(`The transaction ${transactionType} requires a transaction reference`);
    return `transaction/${internal(this).reference}/${transactionType}`;
  };

  /**
   * Render the uri required to process the first stage transactions
   *
   * @param {String} transactionType
   * @return {String}
   * @throws Error
   */
  [_renderFirstStageUri](transactionType) {
    if (!internal(this).gatewayReference || !internal(this).paymentMethodToken) {
      throw new Error(`The transaction ${transactionType} requires both the payment method token and the gateway reference`);
    }
    return `gateway/${internal(this).gatewayReference}/payment-method/${internal(this).paymentMethodToken}/${transactionType}`;
  };

};
