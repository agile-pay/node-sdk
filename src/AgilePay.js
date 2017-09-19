'use strict';

const { internal } = require('./utils');
const Client = require('./Client');
const Credit = require('./Resources/Credit');
const Gateway = require('./Resources/Gateway');
const Schedule = require('./Resources/Schedule');
const Webhook = require('./Resources/Webhook');
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
   * @return {Object} AgilePay Credit
   */
  credit() {
    return new Credit(internal(this).client);
  }

  /**
   * @param {String} reference
   * @return {Object} AgilePay Gateway
   */
  gateway(reference = '') {
    return new Gateway(internal(this).client, reference);
  }

  /**
   * @param {String} reference
   * @return {Object} AgilePay Schedule
   */
  schedule(reference = '') {
    return new Schedule(internal(this).client, reference);
  }

  /**
   * @param {String} reference
   * @return {Object} AgilePay Webhook
   */
  webhook(reference = '') {
    return new Webhook(internal(this).client, reference);
  }

  /**
   * @param {String} reference
   * @return {Object} AgilePay Transaction
   */
  transaction(reference = '') {
    return new Transaction(internal(this).client, reference);
  }

  /**
   * @return {Object} AgilePay ClientToken
   */
  clientToken() {
    return new ClientToken(internal(this).client);
  }

  /**
   * @param {String} token
   * @return {Object} AgilePay PaymentMethod
   */
  paymentMethod(token = '') {
    return new PaymentMethod(internal(this).client, token);
  }

  /**
   * @param {String} reference
   * @return {Object} AgilePay TransactionSchedule
   */
  transactionSchedule(reference = '') {
    return new TransactionSchedule(internal(this).client, reference);
  }

};
