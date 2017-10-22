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
    dummy_key: 'dummy_key',
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

    const body = card.getBody();
    assert.equal(card.getStatusCode(), 200);
    assert.isObject(card.getBody());

    assert.equal(body.type, 'card');
    assert.isObject(body);
    assert.isObject(body.details);
    assert.equal(body.details.holder_name, 'Mario Rossi');
    assert.isTrue(body.kept);
    assert.isObject(body.details.number);
  });

  it('should createGatewayToken', async () => {
    const gateway = await new Gateway(client, 'toktok').create('test', options);

    assert.isObject(gateway);
    assert.equal(gateway.getStatusCode(), 200);
    assert.isObject(gateway.getBody());

    const parsedGatewayBody = gateway.getBody();
    const reference = parsedGatewayBody.reference;

    const gatewayToken = await this.paymentMethod.createGatewayToken(reference, {
      'cvv': '123',
      'number': '4111111111111111',
      'holder_name': 'Mario Rossi',
      'expiry_month': '12',
      'expiry_year': '17',
    });

    const gatewayTokenBody = gatewayToken.getBody();
    this.token = gatewayTokenBody.token;

    assert.equal(gatewayToken.getStatusCode(), 200);
    assert.isObject(gateway.getBody());
    assert.equal(gatewayTokenBody.type, 'gateway_token');
    assert.isObject(gatewayTokenBody.details);
    assert.isString(gatewayTokenBody.token);
    assert.isTrue(gatewayTokenBody.kept);
    assert.isObject(gatewayTokenBody.details.tokenization_data);
    assert.isObject(gatewayTokenBody.details.card);
    assert.equal(gatewayTokenBody.details.card.holder_name, 'Mario Rossi');

  });

  it('should retrieve the payment method details', async() => {
    const response = await new PaymentMethod(client, this.token).get();

    assert.isObject(response);
    assert.equal(response.getStatusCode(), 200);
    assert.isObject(response.getBody());
  });

  it('should throw error when updating a non existing gateway', async() => {
    try {

      const response = await new Gateway(client).update(options);
    } catch (err) {
      assert.equal(err.getStatusCode(), 404);
    }

  });
});
