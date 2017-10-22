'use strict';

const { internal } = require('../utils');
const { PaginatedResponse } = require('../Response');

/**
 * @typedef {Object} Customer
 * AgilePay Customer
 */
module.exports = class Customer {

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
   * Retrieve a specific customer
   *
   * @returns {Promise.<Object>} AgilePay Client response
   */
  get() { return internal(this).client.get(`customers/${internal(this).reference}`); }

  /**
   * Retrieve the list of customers
   *
   * @param {Object} options
   * @returns {Promise.<Object>} AgilePay Paginated Response
   */
  getList(options) {

    const response = internal(this).client.get('customers', { 'params': options });

    return new PaginatedResponse(internal(this).client, response);
  };

  /**
   * Create a new customer
   *
   * @param {Object} customer
   * @returns {Promise.<Object>} AgilePay Client response
   */
  create(customer) {
    return internal(this).client.post('customers', { 'data': customer });
  }

  /**
   * Update an existing customer
   * @param {Object} data
   * @returns {Promise.<Object>} AgilePay Client response
   */
  update(customer) {
    return internal(this).client.put(`customers/${internal(this).reference}`, { 'data': customer });
  }

  /**
   * Attach a payment method to a customer
   *
   * @param {String} paymentMethod
   * @return {Promise.<Object>} AgilePay Client response
   */
  attachPaymentMethod(paymentMethod) {
    return internal(this).client.put(`customers/${internal(this).reference}/payment-methods/${paymentMethod}`);
  }

};
