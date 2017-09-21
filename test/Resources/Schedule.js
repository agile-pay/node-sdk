'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');
const Schedule = require('../../src/Resources/Schedule');
const AdHoc = require('../../src/Resources/Schedule/AdHoc');

// Need key and secret from env
const config = {
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

const options = {
  dummy_key: process.env.DUMMY_KEY,
};

const client = new Client(config);

describe('Test Transactions', () => {

  it('should setup a new AdHoc', async () => {
    const adHoc = await new Schedule(client).adHoc();

    adHoc.should.be.instanceOf(AdHoc);

  });

});
