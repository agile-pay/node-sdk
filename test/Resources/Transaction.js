'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const Gateway = require('../../src/Resources/Gateway');
const PaymentMethod = require('../../src/Resources/PaymentMethod');
const Transaction = require('../../src/Resources/Transaction');

// Need key and secret from env
const config = {
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

const options = {
  dummy_key: process.env.DUMMY_KEY,
};

const client = new Client(config);

describe('Test Transactions', () => {

  it('should set payment', async () => {
    const gateway = await new Gateway(client).create('test', options);
    this.reference = gateway.getBody().reference;

    const gatewayToken = await new PaymentMethod(client).createGatewayToken(this.reference, {
      number: '4111111111111111',
      expiry_year: 17,
      expiry_month: 12,
      cvv: 123,
      holder_name: 'John Smith',
    });

    const token = gatewayToken.getBody().token;

    const transaction = await new Transaction(client, 'totok')
      .setPaymentMethod(token)
      .auth(5000, 'GBP');

    if (transaction.getBody().successful) {
      const response = transaction.getBody().successful;
      assert.isTrue(response)
    } else {
      const error = transaction.getBody().errors;
      console.log(error);
    }

  });

  // it('should get transaction', async () => {
  //   const transaction = await new Transaction(client, 'totok').get();
  //   console.log(transaction)

  // });
});
