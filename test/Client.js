'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../src/Client');
const HttpError = require('../src/Errors/HttpError');

describe('test Client', () => {
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };


  const fields = {
    dummy_key: process.env.DUMMY_KEY,
    secret_key: 'dummy_public',
  };

  const options = {
    'body': { 'type': 'test', 'fields': fields }
  };

  const client = new Client(config);

  it('should test getConfig', () => {

    client.should.be.instanceOf(Client);
    client.setConfig(config);
    client.should.be.instanceOf(Client);

    assert.containsAllKeys(client.getConfig(), Object.keys(config));
    assert.containsAllKeys(client.getConfig(), [ 'retries' ]);
  });

  it('should test get method', () => {

    client.should.be.instanceOf(Client);
    return client.get(`transaction/ZsOU2RXntdnhvB0x`)
      .then(res => res)
      .catch(e =>
        e.should.be.instanceOf(HttpError) &&
        assert.equal(e.statusCode, 401) &&
        assert.isString(e.body)
      );
  });

  it('should test put method', async () => {
    const reference = 'ZsOU2RXntdnhvB0x';

    const response = await client.put(`gateway/${reference}/update`, options);
    assert.isObject(response);
    assert.equal(response.statusCode, 200);
    assert.isString(response.body);
  });

  it('should test post method', async () => {
    const response = await client.post('gateways', options);
    assert.isObject(response);
    assert.equal(response.statusCode, 200);
    assert.isString(response.body);
  });

  it('should throw an error if using a non esisting reference', () => {
    const wrongReference = 'Ou5Eppowe2dvkYlR';

    return client.delete(`transaction-schedule/${wrongReference}`)
      .then(res => res)
      .catch(e =>
        e.should.be.instanceOf(HttpError) &&
        assert.equal(e.statusCode, 401) &&
        assert.isString(e.body)
      );
  });

});
