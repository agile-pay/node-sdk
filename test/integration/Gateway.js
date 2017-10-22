'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const Gateway = require('../../src/Resources/Gateway');

beforeEach(async () => {
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  this.client = new Client(config);
  this.gateway = new Gateway(this.client);
  this.mockGateway = await new Gateway(this.client).create('test', { 'dummy_key': 'dummy' });

});

describe('Gateway', () => {

  it('should get a gateway', async() => {
    const reference = this.mockGateway.getBody()['reference'];

    const get = await this.gateway.setReference(reference).get();

    assert.equal(get.getStatusCode(), 200);
    assert.equal(get.getBody()['reference'], reference);

  });

  it('should retrieve the list of gateway', async() => {

    const list = await this.gateway.getList();
    const response = await list.getResponse();

    assert.equal(response.getStatusCode(), 200);

  });

  it('should create a new gateway', async() => {
    const newGateway = this.mockGateway;

    assert.equal(newGateway.getStatusCode(), 200);
    assert.isObject(newGateway.getBody());
    assert.isTrue(newGateway.getBody().hasOwnProperty('reference'));
  });

  it('should update an existing customer', async() => {
    const reference = this.mockGateway.getBody()['reference'];

    const updatedGateway = await this.gateway.setReference(reference).update({ 'fields': { 'dummy_key': 'dummy' } });

    assert.equal(updatedGateway.getStatusCode(), 200);
    assert.isTrue(updatedGateway.getBody().hasOwnProperty('reference'));

  });

});
