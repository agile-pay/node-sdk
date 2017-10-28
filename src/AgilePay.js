'use strict';

const { internal } = require('./utils');
const Client = require('./Client');
const Credit = require('./Resources/Credit');
const Webhook = require('./Resources/Webhook');
const Gateway = require('./Resources/Gateway');
const Schedule = require('./Resources/Schedule');
const Customer = require('./Resources/Customer');
const Transaction = require('./Resources/Transaction');
const ClientToken = require('./Resources/ClientToken');
const PaymentMethod = require('./Resources/PaymentMethod');
const TransactionSchedule = require('./Resources/TransactionSchedule');
/**
 * @typedef {Object} ClientToken
 * AgilePay
 */
module.exports = class AgilePay {

  /**
   *
   * @param {Object} config
   */
  constructor(config) {
    internal(this).client = new Client(config);
  }

  /**
   * Returns an instance of AgilePay Credit resource
   *
   * @returns {Object} AgilePay Credit
   */
  credit() {
    return new Credit(internal(this).client);
  }

  /**
   * Returns an instance of AgilePay Gateway resource
   *
   * @param {String} reference
   * @returns {Object} AgilePay Gateway
   */
  gateway(reference = '') {
    return new Gateway(internal(this).client, reference);
  }

  /**
   * Returns an instance of AgilePay Customer resource
   *
   * @param {String} reference
   * @returns {Object} AgilePay Customer
   */
  customer(reference) {
    return new Customer(internal(this).client, reference);
  }

  /**
   * Returns an instance of AgilePay Schedule resource
   *
   * @param {String} reference
   * @returns {Object} AgilePay Schedule
   */
  schedule(reference = '') {
    return new Schedule(internal(this).client, reference);
  }

  /**
   *  Returns an instance of AgilePay Webhook resource
   *
   * @param {String} reference
   * @returns {Object} AgilePay Webhook
   */
  webhook(reference = '') {
    return new Webhook(internal(this).client, reference);
  }

  /**
   * Returns an instance of AgilePay Transaction resource
   *
   * @param {String} reference
   * @returns {Object} AgilePay Transaction
   */
  transaction(reference = '') {
    return new Transaction(internal(this).client, reference);
  }

  /**
   * Returns an instance of AgilePay ClientToken resource
   *
   * @returns {Object} AgilePay ClientToken
   */
  clientToken() {
    return new ClientToken(internal(this).client);
  }

  /**
   * Returns an instance of AgilePay PaymentMethod resource
   *
   * @param {String} token
   * @returns {Object} AgilePay PaymentMethod
   */
  paymentMethod(token = '') {
    return new PaymentMethod(internal(this).client, token);
  }

  /**
   * Returns an instance of AgilePay TransactionSchedule resource
   *
   * @param {String} reference
   * @returns {Object} AgilePay TransactionSchedule
   */
  transactionSchedule(reference = '') {
    return new TransactionSchedule(internal(this).client, reference);
  }

};
