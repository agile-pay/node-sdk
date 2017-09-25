'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const TransactionSchedule = require('../../src/Resources/TransactionSchedule');

describe('Test Transaction Schedule', () => {

  // Need key and secret from env
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  const client = new Client(config);

  it('should set a reference', () => {
    this.TransactionSchedule = new TransactionSchedule(client, 'toktok');
    const reference = this.TransactionSchedule.setReference('toktok');
    reference.should.be.instanceOf(TransactionSchedule);
  });

  it('should set a PaymentMethod', () => {
    const paymentMethod = this.TransactionSchedule.setPaymentMethod('toktok');
    paymentMethod.should.be.instanceOf(TransactionSchedule);
  });

  it('should set a Webhook', () => {
    const webhook = this.TransactionSchedule.setWebhook('toktok');
    webhook.should.be.instanceOf(TransactionSchedule);
  });

  it('should set a Webhook', () => {
    const schedule = this.TransactionSchedule.setSchedule('toktok');
    schedule.should.be.instanceOf(TransactionSchedule);
  });
});
