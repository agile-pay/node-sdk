'use strict';

const { internal } = require('../utils');
const { PaginatedResponse } = require('../Response');

const _renderSecondStageUri = Symbol('secondStageUri');

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
  constructor(client, reference = null) {
    internal(this).client = client;
    internal(this).reference = reference;
    internal(this).gatewayReference = null;
    internal(this).paymentMethodToken = null;
  }

  /**
   * @returns {Promise.<Object>} AgilePay Client response
   */
  get() { return internal(this).client.get(`transactions/${internal(this).reference}`); }

  /**
   * Retrieve the transaction list
   *
   * @param {Object} options
   * @returns {Promise.<Object>} AgilePay Client response
   */
  getList(options) {

    let params = {};

    if (internal(this).gatewayReference) {
      params['gateway'] = internal(this).gatewayReference;
    }

    if (internal(this).paymentMethodToken) {
      params['payment_method'] = internal(this).paymentMethodToken;
    }

    params = Object.assign({}, params, options);

    return internal(this).client.get('transactions', { 'params': params })
      .then(res => new PaginatedResponse(internal(this).client, res))
      .catch(err => new PaginatedResponse(internal(this).client, err));
  };

  /**
   * Charge a credit card
   *
   * @param {String} amount
   * @param {String} currency
   * @param {Object} data
   * @returns {Promise.<Object>} AgilePay Client response
   */
  auth(amount, currency, data = {}) {
    const body = {
      'amount': amount,
      'currency_code': currency.toLocaleLowerCase(),
      'payment_method': internal(this).paymentMethodToken,
    };

    if (internal(this).gatewayReference) {
      body['gateway'] = internal(this).gatewayReference;
    }

    return internal(this).client.post('transactions/auth', { 'data': Object.assign({}, body, data) });
  }

  /**
   * Voids a previously authorized transaction
   *
   * @returns {Promise.<Object>} AgilePay Client response
   */
  void() {
    return internal(this).client.post(this[_renderSecondStageUri]('void'));
  }

  /**
   * Refund a settled transaction
   *
   * @param {Number} amount
   * @param {String} currency
   * @returns {Promise.<Object>} AgilePay Client response
   */
  credit(amount, currency) {
    const body = {};

    if (amount) {
      body['amount'] = amount;
    }

    if (currency) {
      body['currency_code'] = currency;
    }

    if (Object.keys(body).length === 0 && body.constructor === Object) {
      return internal(this).client.post(this[_renderSecondStageUri]('credit'));
    }

    return internal(this).client.post(this[_renderSecondStageUri]('credit'), { 'data': body });
  }

  /**
   * Settle a previously authorized transaction
   *
   * @param {Number} amount
   * @param {String} currency
   * @returns {Promise.<Object>} AgilePay Client response
   */
  capture(amount, currency) {

    const body = {};

    if (amount) {
      body['amount'] = amount;
    }

    if (currency) {
      body['currency_code'] = currency;
    }

    if (Object.keys(body).length === 0 && body.constructor === Object) {
      return internal(this).client.post(this[_renderSecondStageUri]('capture'));
    }

    return internal(this).client.post(this[_renderSecondStageUri]('capture'), { 'data': body });
  };

  /**
   * Set the transaction reference
   *
   * @param {String} reference
   * @returns this
   */
  setReference(reference) {
    internal(this).reference = reference;
    return this;
  }

  /**
   * Set the gateway to use to perform the first stage transactions
   *
   * @param {String} reference
   * @returns this
   */
  setGateway(reference) {
    internal(this).gatewayReference = reference;
    return this;
  }

  /**
   * Set the payment method to perform the first stage transactions
   *
   * @param token
   * @returns this
   */
  setPaymentMethod(token) {
    internal(this).paymentMethodToken = token;
    return this;
  }

  /**
   * render the uri required to process second stage transactions
   *
   * @param {String} transactionType
   * @returns {String}
   * @throws Error
   */
  [_renderSecondStageUri](transactionType) {
    if (!internal(this).reference) throw new Error(`The transaction ${transactionType} requires a transaction reference`);
    return `transactions/${internal(this).reference}/${transactionType}`;
  };

};
