'use strict';

const uniqid = require('uniqid');
const chai = require('chai');
const assert = chai.assert;    // Using Assert style
const expect = chai.expect;    // Using Expect style
const should = chai.should()
require('dotenv').config()

const Client = require('../../src/Client');
const Webhook = require('../../src/Resources/Webhook');

describe('Test Webhook', () => {

// Need key and secret from env
const opts = {
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

const options = {
  dummy_key: process.env.DUMMY_KEY,
};

const client = new Client(opts);
const webhook = new Webhook(client, '');

it('should create a new gateway', async() => {
  const response = await webhook.create(`https://requestb.in/${uniqid.process()}`)

  assert.isObject(response)
  assert.equal(response.statusCode, 200)
  assert.isString(response.body)
});

// it('should throw an error if creating a gateway with wrong credentials', async() => {
//   const response = await gateway.create('test', {'wrong_key': 'key', 'wrong_secret': 'secret'})
//   assert.equal(response.statusCode, 500)
// });

// it('should update an existing gateway', async() => {
//   const gateway = new Gateway(client, 'iOosTWoOdEp9OHsT');
//   const response = await gateway.update(options)
//   assert.isObject(response)
//   assert.equal(response.statusCode, 200)
//   assert.isString(response.body)
// });

// it('should throw error when updating a non existing gateway', async() => {
//   const gateway = new Gateway(client, '');
//   const response = await gateway.update(options)
//   assert.equal(response.statusCode, 404)
//   assert.equal(response.message, 'Not Found')
// });

});

