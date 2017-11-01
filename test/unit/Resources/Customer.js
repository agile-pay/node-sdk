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
    const response = await customer.create(
      { 'first_name': 'john',
        'last_name': 'smith',
        'email': 'some@paday.com',
        'home_phone': '039384484',
        'mobile_phone': '237232872828',
      });
    // console.log(response)
    this.reference = response.getBody()['reference'];
    assert.isObject(response);
    assert.equal(response.getStatusCode(), 200);
    assert.isObject(response.getBody());
  });

  it('should be unprocessable if creating a customer with wrong credentials', async() => {
    try {
      const response = await customer.create(
        { 'first': 'john',
          'last': 'smith',
          'em': 'some@paday.com',
        });
    } catch (err) {
      assert.equal(err.getStatusCode(), 422);
    }
  });

  it('should update an existing customer', async() => {
    const customer = new Customer(client, this.reference);
    const response = await customer.update(
      { 'first_name': 'john',
        'last_name': 'smith',
        'email': 'some@paday.com',
        'home_phone': '039384484',
        'mobile_phone': '237232872828',
      }
    );
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
