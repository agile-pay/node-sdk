'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const PaymentMethod = require('../../src/Resources/PaymentMethod');
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

  it('should be an instance of PaymentMethod', () => {
    this.paymentMethod = new PaymentMethod(client, 'toktok');
    const keep = this.paymentMethod.keep();
    keep.should.be.instanceOf(PaymentMethod);
  });

  it('should create a card', async() => {
    const card = await this.paymentMethod.createCard({
      'cvv': '123',
      'number': '4111111111111111',
      'holder_name': 'Mario Rossi',
      'expiry_month': '12',
      'expiry_year': '17',
    });
    const parsedBody = JSON.parse(card.body);
    assert.equal(card.statusCode, 200);
    assert.isString(card.body);

    assert.equal(parsedBody.type, 'card');
    assert.isObject(parsedBody);
    assert.isObject(parsedBody.details);
    assert.equal(parsedBody.details.holder_name, 'Mario Rossi');
    assert.isTrue(parsedBody.kept);
    assert.isObject(parsedBody.details.number);
  });

  it('should createGatewayToken', async() => {
    const gateway = await new Gateway(client, '').create('test', options);

    assert.isObject(gateway);
    assert.equal(gateway.statusCode, 200);
    assert.isString(gateway.body);

    const parsedGatewayBody = JSON.parse(gateway.body);
    const reference = parsedGatewayBody.reference;

    const gatewayToken = await this.paymentMethod.createGatewayToken(reference, {
      'cvv': '123',
      'number': '4111111111111111',
      'holder_name': 'Mario Rossi',
      'expiry_month': '12',
      'expiry_year': '17',
    });

    const gatewayTokenBody = JSON.parse(gatewayToken.body);
    assert.equal(gatewayToken.statusCode, 200);
    assert.isString(gateway.body);

    assert.equal(gatewayTokenBody.type, 'gateway_token');
    assert.isObject(gatewayTokenBody.details);
    assert.isString(gatewayTokenBody.token);
    assert.isTrue(gatewayTokenBody.kept);
    assert.isObject(gatewayTokenBody.details.tokenization_data);
    assert.isObject(gatewayTokenBody.details.card);
    assert.equal(gatewayTokenBody.details.card.holder_name, 'Mario Rossi');
  });

  // it('should retrieve the payment method details', async() => {
  //   const details = await new PaymentMethod(client, '59bbb8da0a149').get();

  //   // assert.isObject(response);
  //   // assert.equal(response.statusCode, 200);
  //   // assert.isString(response.body);
  //   console.log(details)
  // });

  // it('should throw error when updating a non existing gateway', async() => {
  //   const gateway = new Gateway(client, '');
  //   const response = await gateway.update(options);
  //   assert.equal(response.statusCode, 404);
  //   assert.equal(response.message, 'Request is not found');
  // });
});
