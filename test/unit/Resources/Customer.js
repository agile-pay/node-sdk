'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../../src/Client');
const Customer = require('../../../src/Resources/Customer');

describe('Test Customer', () => {

  // Need key and secret from env
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  const options = {
    dummy_key: 'dummy_key',
  };

  const client = new Client(config);
  const customer = new Customer(client);

  it('should set a customer reference', async() => {
    const response = await customer.setReference('randomRef');
    response.should.be.instanceOf(Customer);
  });

  it('should create a new customer', async() => {
    const response = await customer.create('test', options);
    assert.isObject(response);
    assert.equal(response.getStatusCode(), 200);
    assert.isObject(response.getBody());
  });

  it('should be unprocessable if creating a customer with wrong credentials', async() => {
    try {
      const response = await customer.create('test', { 'wrong_key': 'key', 'wrong_secret': 'secret' });
    } catch (err) {
      assert.equal(err.getStatusCode(), 422);
    }
  });

  it('should update an existing customer', async() => {
    const customer = new Customer(client, 'iOosTWoOdEp9OHsT');
    const response = await customer.update(options);
    assert.isObject(response);
    assert.equal(response.getStatusCode(), 200);
    assert.isObject(response.getBody());
  });

  it('should throw error when updating a non existing customer', async() => {
    try {
      const response = new Customer(client).update(options);
    } catch (err) {
      assert.equal(err.getStatusCode(), 404);
    }
  });

  it('should Attach a payment method to a customer', async() => {
    try {
      const response = new Customer(client).update(options);
    } catch (err) {
      assert.equal(err.getStatusCode(), 404);
    }
  });
});
