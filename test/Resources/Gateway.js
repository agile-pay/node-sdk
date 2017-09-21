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
  const gateway = new Gateway(client);

  it('should create a new gateway', async() => {
    const response = await gateway.create('test', options);
    assert.isObject(response);
    assert.equal(response.getStatusCode(), 200);
    assert.isObject(response.getBody());
  });

  it('should be unprocessable if creating a gateway with wrong credentials', async() => {
    try {
      const response = await gateway.create('test', { 'wrong_key': 'key', 'wrong_secret': 'secret' });
    } catch (err) {
      assert.equal(err.getStatusCode(), 422);
    }
  });

  it('should update an existing gateway', async() => {
    const gateway = new Gateway(client, 'iOosTWoOdEp9OHsT');
    const response = await gateway.update(options);
    assert.isObject(response);
    assert.equal(response.getStatusCode(), 200);
    assert.isObject(response.getBody());
  });

  it('should throw error when updating a non existing gateway', async() => {
    try {
      const response = new Gateway(client).update(options);
    } catch (err) {
      assert.equal(err.getStatusCode(), 404);
    }
    // assert.equal(response.message, 'Request is not found');
  });
});
