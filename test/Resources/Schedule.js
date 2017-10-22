'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const Schedule = require('../../src/Resources/Schedule');
const AdHoc = require('../../src/Resources/Schedule/AdHoc');
const { Response } = require('../../src/Response');

// Need key and secret from env
const config = {
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

const options = {
  dummy_key: 'dummy_key',
};

const client = new Client(config);

describe('Test Schedule', () => {

  it('should setup a new AdHoc', async () => {
    const adHoc = await new Schedule(client).adHoc();

    adHoc.should.be.instanceOf(AdHoc);

  });

});

describe('Test Adhoc', () => {

  it('should create a new schedule of type ad_hoc', async () => {
    const response = await new AdHoc(client).create(options);

    response.should.be.instanceOf(Response);
    assert.isObject(response);
    assert.equal(response.getStatusCode(), 200);
    assert.isObject(response.getBody());
  });

});
