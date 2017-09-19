'use strict';

const chai = require('chai');
const assert = chai.assert;
require('dotenv').config();

const Client = require('../../src/Client');
const Gateway = require('../../src/Resources/Gateway');

describe('Test Gateway', () => {

  // Need key and secret from env
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  const options = {
    dummy_key: process.env.DUMMY_KEY,
  };

  const client = new Client(config);
  const gateway = new Gateway(client, '');

  it('should create a new gateway', async() => {
    const response = await gateway.create('test', options);
    assert.isObject(response);
    assert.equal(response.statusCode, 200);
    assert.isString(response.body);
  });

  it('should be unprocessable if creating a gateway with wrong credentials', async() => {
    const response = await gateway.create('test', { 'wrong_key': 'key', 'wrong_secret': 'secret' });
    assert.equal(response.statusCode, 422);
    assert.equal(response.message, 'Request is unprocessable');
  });

  it('should update an existing gateway', async() => {
    const gateway = new Gateway(client, 'iOosTWoOdEp9OHsT');
    const response = await gateway.update(options);
    assert.isObject(response);
    assert.equal(response.statusCode, 200);
    assert.isString(response.body);
  });

  it('should throw error when updating a non existing gateway', async() => {
    const gateway = new Gateway(client, '');
    const response = await gateway.update(options);
    assert.equal(response.statusCode, 404);
    assert.equal(response.message, 'Request is not found');
  });
});
