'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const Transaction = require('../../src/Resources/Transaction');
const Gateway = require('../../src/Resources/Gateway');
const PaymentMethod = require('../../src/Resources/PaymentMethod');

beforeEach(async () => {
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  this.client = new Client(config);
  this.transaction = new Transaction(this.client);
  this.mockGateway = await new Gateway(this.client).create('test', { 'dummy_key': 'dummy' });
  this.card = await new PaymentMethod(this.client).createCard({
    'cvv': '123',
    'number': '4111111111111111',
    'holder_name': 'Mario Rossi',
    'expiry_year': '17',
    'expiry_month': '12',
  });

  this.transaction.setGateway(this.mockGateway.getBody()['reference']);
  this.transaction.setPaymentMethod(this.card.getBody()['token']);

});

describe('Transaction', () => {

  it('should retrieve a transaction', async() => {
    const auth = await this.transaction.auth(500, 'EUR');
    const reference = auth.getBody()['reference'];
    const get = await new Transaction(this.client, reference).get();

    assert.equal(get.getStatusCode(), 200);
    assert.equal(get.getBody()['reference'], reference);

  });

  it('should retrieve transactions list', async() => {

    let list = await this.transaction.getList();
    const response = await list.getResponse();

    assert.equal(response.getStatusCode(), 200);

    // testing retrieving by pages as well
    list = await this.transaction.getList({ 'page': 3 });
    const res = list.getResponse();

    assert.equal(res.getStatusCode(), 200);
    assert.equal(list.currentPage(), 1);
  });

  it('should charge a credit card', async() => {
    const charge = await this.transaction.auth(500, 'EUR');

    assert.equal(charge.getStatusCode(), 200);
    assert.isObject(charge.getBody());
    assert.isTrue(charge.getBody().hasOwnProperty('reference'));
  });

  it('should void a previously authorized transaction', async() => {
    const transAuth = await this.transaction.auth(500, 'EUR');
    const reference = transAuth.getBody()['reference'];
    const voided = await new Transaction(this.client, reference).void();

    assert.equal(voided.getStatusCode(), 200);
    assert.equal(voided.getBody()['type'], 'void');

    assert.isTrue(voided.getBody().hasOwnProperty('reference'));
    assert.isTrue(voided.getBody().hasOwnProperty('parent_reference'));
  });

  it('should settle a previously authorized transaction', async() => {
    const transAuth = await this.transaction.auth(500, 'EUR');
    const reference = transAuth.getBody()['reference'];
    const captured = await new Transaction(this.client, reference).capture();

    assert.equal(captured.getStatusCode(), 200);
    assert.equal(captured.getBody()['type'], 'capture');

    assert.isTrue(captured.getBody().hasOwnProperty('reference'));
    assert.isTrue(captured.getBody().hasOwnProperty('parent_reference'));

    // testing by providing a different amount and currency
    const transAuthGBP = await this.transaction.auth(500, 'EUR');
    const referenceGBP = transAuthGBP.getBody()['reference'];
    const capturedGBP = await new Transaction(this.client, referenceGBP).capture(100, 'GBP');

    assert.equal(capturedGBP.getStatusCode(), 200);
    assert.equal(capturedGBP.getBody()['type'], 'capture');

    assert.isTrue(capturedGBP.getBody().hasOwnProperty('reference'));
    assert.isTrue(capturedGBP.getBody().hasOwnProperty('parent_reference'));
    assert.equal(capturedGBP.getBody()['details']['amount'], '100');
    assert.equal(capturedGBP.getBody()['details']['currency_code'], 'GBP');
  });

  // it('should refund a settled transaction', async() => {
  //   const transAuth = await this.transaction.auth(500, 'EUR');
  //   const reference = transAuth.getBody()['reference'];
  //   const credited = await new Transaction(this.client, reference).credit();

  //   console.log(credited)

  //   assert.equal(credited.getStatusCode(), 200);
  //   assert.equal(credited.getBody()['type'], 'credit');

  //   assert.isTrue(credited.getBody().hasOwnProperty('reference'));
  //   assert.isTrue(credited.getBody().hasOwnProperty('parent_reference'));

  //   // testing by providing a different amount and currency
  //   const transAuthGBP = await this.transaction.auth(500, 'EUR');

  //   console.log(transAuthGBP);

  //   const referenceGBP = transAuthGBP.getBody()['reference'];
  //   const creditedGBP = await new Transaction(this.client, referenceGBP).capture(100, 'GBP');

  //   assert.equal(creditedGBP.getStatusCode(), 200);
  //   assert.equal(creditedGBP.getBody()['type'], 'capture');

  //   assert.isTrue(creditedGBP.getBody().hasOwnProperty('reference'));
  //   assert.isTrue(creditedGBP.getBody().hasOwnProperty('parent_reference'));
  //   assert.equal(creditedGBP.getBody()['details']['amount'], '100');
  //   assert.equal(creditedGBP.getBody()['details']['currency_code'], 'GBP');
  // });
});
