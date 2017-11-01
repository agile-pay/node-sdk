'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../../src/Client');
const Transaction = require('../../../src/Resources/Transaction');

// Need key and secret from env
const config = {
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

describe('Test Transaction', () => {
  this.client = new Client(config);
  this.transaction = new Transaction(this.client, 'totok');

  it('should set a Transaction reference', async() => {
    const response = await this.transaction.setReference('randomRef');
    response.should.be.instanceOf(Transaction);
  });

  it('should set a Transaction gateway reference', async() => {
    const response = await this.transaction.setGateway('randomRef');
    response.should.be.instanceOf(Transaction);
  });

  it('should set a Transaction payment method token', async() => {
    const response = await this.transaction.setPaymentMethod('randomToken');
    response.should.be.instanceOf(Transaction);
  });

});
