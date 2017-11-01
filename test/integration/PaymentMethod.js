'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const PaymentMethod = require('../../src/Resources/PaymentMethod');
const Gateway = require('../../src/Resources/Gateway');

beforeEach(async () => {
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  this.client = new Client(config);
  this.card = await new PaymentMethod(this.client).createCard({
    'cvv': '123',
    'number': '4111111111111111',
    'holder_name': 'Mario Rossi',
    'expiry_year': '17',
    'expiry_month': '12',
  });

  this.gatewayToken = async function (fromExisting = false) {
    const gateway = await new Gateway(this.client).create('test', { 'dummy_key': 'dummy' });
    const reference = gateway.getBody()['reference'];

    if (!fromExisting) {
      const pm = await new PaymentMethod(this.client).createGatewayToken(reference, {
        'cvv': '123',
        'number': '4111111111111111',
        'holder_name': 'Mario Rossi',
        'expiry_year': '17',
        'expiry_month': '12',
      });
      return pm;
    }
    const card = this.card.getBody()['token'];
    const pmO = await new PaymentMethod(this.client, card).createGatewayToken(reference);
    return pmO;
  };

  this.paymentMethod = new PaymentMethod(this.client);

});

describe('PaymentMethod', () => {

  it('should retrieve the payment method details', async () => {
    const token = this.card.getBody()['token'];
    const get = await this.paymentMethod.setToken(token).get();

    assert.equal(get.getStatusCode(), 200);
    assert.equal(get.getBody()['token'], token);

  });

  it('should retrieve the payment methods list', async() => {

    const list = await this.paymentMethod.getList();
    const response = await list.getResponse();

    assert.equal(response.getStatusCode(), 200);

  });

  it('should created a card', async() => {
    const card = this.card;

    assert.equal(card.getStatusCode(), 200);
    assert.isObject(card.getBody());
    assert.isTrue(card.getBody().hasOwnProperty('token'));
  });

  it('should update an existing customer', async() => {
    const createdToken = await this.gatewayToken(true);

    assert.equal(createdToken.getStatusCode(), 200);
    assert.isTrue(createdToken.getBody().hasOwnProperty('token'));

    const created = await this.gatewayToken(false);

    assert.equal(created.getStatusCode(), 200);
    assert.isTrue(created.getBody().hasOwnProperty('token'));

  });

});
