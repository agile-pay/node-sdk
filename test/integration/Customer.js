'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const Customer = require('../../src/Resources/Customer');

beforeEach(async () => {
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  const options = {
    dummy_key: 'dummy_key',
  };

  this.client = new Client(config);
  this.customer = new Customer(this.client);
  this.mockCustomer = await new Customer(this.client).create({
    'email': `test${Math.random()}@email.com`,
    'last_name': 'Rossi',
    'first_name': 'Mario',
  });

});

describe('Customer', () => {

  it('should retrieve a customer', async() => {
    const reference = this.mockCustomer.getBody()['reference'];

    const get = await this.customer.setReference(reference).get();

    assert.equal(get.getStatusCode(), 200);
    assert.equal(get.getBody()['reference'], reference);

  });

  it('should retrieve the list of customers', async() => {

    const list = await this.customer.getList();
    const response = await list.getResponse();

    assert.equal(response.getStatusCode(), 200);

  });

  it('should create a new customer', async() => {
    const newCustomer = this.mockCustomer;

    assert.equal(newCustomer.getStatusCode(), 200);
    assert.isObject(newCustomer.getBody());
    assert.isTrue(newCustomer.getBody().hasOwnProperty('reference'));
  });

  it('should update an existing customer', async() => {
    const reference = this.mockCustomer.getBody()['reference'];
    const newEmail = 'updatedemail@test.com';
    const updatedCustomer = await this.customer.setReference(reference).update({ 'email': newEmail });

    assert.equal(updatedCustomer.getStatusCode(), 200);
    assert.isTrue(updatedCustomer.getBody().hasOwnProperty('email'));
  });

});
