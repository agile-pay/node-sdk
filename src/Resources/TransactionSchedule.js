'use strict';

const { internal } = require('../utils');

/**
 * @typedef {Object} TransactionSchedule
 * AgilePay TransactionSchedule
 */
module.exports = class TransactionSchedule {

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
    internal(this).webhookReference = null;
    internal(this).scheduleReference = null;
    internal(this).paymentMethodToken = null;
  }

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
   * Set the webhook reference for scheduled transactions
   *
   * @param reference
   * @returns $this
   */
  setWebhook(reference) {
    internal(this).webhookReference = reference;
    return this;
  }

  /**
   * The wrapper schedule to be associated to the scheduled transaction
   *
   * @param reference
   * @returns $this
   */
  setSchedule(reference) {
    internal(this).scheduleReference = reference;
    return this;
  }

  /**
   * Schedule a transaction to be executed in the future
   *
   * @param {String} type The type of transaction to be scheduled
   * @param {String} at The datetime when the transaction will be executed
   * @param {String} timezone The timezone
   * @param {Object} data The transaction data
   * @param {Array} retries The retries object
   * @returns {Promise.<Object>} AgilePay Client response
   */
  schedule(type, at, timezone, data, retries = []) {
    const notMandatory = {};

    if (retries) notMandatory['retries'] = retries;
    if (internal(this).webhookReference) notMandatory['webhook'] = internal(this).webhookReference;
    if (internal(this).scheduleReference) notMandatory['schedule'] = internal(this).scheduleReference;
    return internal(this).client.post('transaction-schedules',
      {
        'data': Object.assign({}, {
          'transaction_type': type,
          'schedule_at': at,
          'timezone': timezone,
          'gateway': internal(this).gatewayReference,
          'payment_method': internal(this).paymentMethodToken,
          'transaction_data': data,
        }, notMandatory),
      }
    );
  }

  /**
   * Delete a scheduled transaction
   *
   * @returns {Promise.<Object>} AgilePay Client response
   */
  delete() {
    return internal(this).client.delete(`transaction-schedules/${internal(this).reference}`);
  };

};
