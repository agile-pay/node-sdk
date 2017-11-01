'use strict';

const chai = require('chai');
const assert = chai.assert; // Using Assert style
const expect = chai.expect; // Using Expect style
const should = chai.should();
require('dotenv').config();

const Client = require('../../../src/Client');
const Webhook = require('../../../src/Resources/Webhook');

describe('Test Webhook', () => {

// Need key and secret from env
  const opts = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  const options = {
    dummy_key: 'dummy_key',
  };

  const client = new Client(opts);
  const webhook = new Webhook(client);

  // it('should create a new gateway', async() => {
  //   const response = await webhook.verifySignature('NDc2ODc0Y2UwMjFiOWRjNTI4YWE4MTM5ZGVjNTYxOTBiYTg2NGIwN2ViMDZkMTBhMzQxYzNkM2NmMzkyNjk0OA==',
  //     '{"event":"scheduled_transaction","payload":{"reference":"5jVVId27ItSfJrqY","timezone":"Europe\/London","scheduled_at":"Sun, 25 Jun 2017 22:15:45 +0100","transaction_type":"auth","transaction_data":{"amount":100,"currency_code":"gbp"},"attempts":[{"transaction":{"type":"auth","reference":"C5peNK0PUtcOpY4q","environment":"local","successful":true,"details":{"ip":null,"amount":100,"currency_code":"gbp","description":null,"merchant_name_descriptor":null,"merchant_location_descriptor":null,"billing_address":[],"shipping_address":[]},"gateway":{"type":"test","reference":"jfQrZZ20XNRtQ50X"},"payment_method":{"type":"card","kept":true,"token":"IqhE7syZ8Gmff6uo","details":{"type":"visa","holder_name":"Mario Rossi","expiry_month":"12","expiry_year":"17","number":{"first_six_digits":"411111","last_four_digits":"1111","masked":"************1111"}}},"submitted_at":{"timestamp":1498425346,"rfc2822":"Sun, 25 Jun 2017 21:15:46 +0000"},"errors":[]}}],"gateway":{"type":"test","reference":"jfQrZZ20XNRtQ50X"},"webhook":"https:\/\/requestb.in\/1j06ht91","payment_method":{"type":"card","kept":true,"token":"IqhE7syZ8Gmff6uo","details":{"type":"visa","holder_name":"Mario Rossi","expiry_month":"12","expiry_year":"17","number":{"first_six_digits":"411111","last_four_digits":"1111","masked":"************1111"}}}}}');

  //   assert.isTrue(response);
  //   //assert.equal(response.getStatusCode(), 200);
  //   //assert.isString(response.body);
  // });

});
