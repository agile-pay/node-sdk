'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../../src/Client');

describe('test Client', () => {
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };

  const client = new Client(config);

  it('should test getConfig', () => {

    client.should.be.instanceOf(Client);
    client.setConfig(config);
    client.should.be.instanceOf(Client);

    assert.containsAllKeys(client.getConfig(), Object.keys(config));
    assert.containsAllKeys(client.getConfig(), [ 'retries' ]);
  });

});
