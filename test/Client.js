'use strict';

const chai = require('chai');
const assert = chai.assert;
const should = chai.should();
require('dotenv').config();

const Client = require('../src/Client');
const Response = require('../src/Response');

describe('test Client', () => {
  const config = {
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  };


  const fields = {
    dummy_key: 'dummy_public'
  };

  const options = {
    'data': { 'type': 'test', 'fields': fields }
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
        e.should.be.instanceOf(Response) &&
        assert.equal(e.getStatusCode(), 404) &&
        assert.isObject(e.getBody())
      );
  });

  it('should test put method', async () => {
    const reference = 'ZsOU2RXntdnhvB0x';

    const response = await client.put(`gateway/${reference}/update`, options);
    assert.isObject(response);
    assert.equal(response.getStatusCode(), 200);
    assert.isObject(response.getBody());
  });

  // it('should test post method', async () => {
  //   const response = await client.post('gateways', options);
  //   assert.isObject(response);
  //   assert.equal(response.getStatusCode(), 200);
  //   assert.isObject(response.getBody());
  // });

  // it('should test post method', () => {
  //  return client.post('gateways')
  //     .then(response => 
  //       assert.isObject(response),
  //       assert.equal(response.getStatusCode(), 200),
  //       assert.isObject(response.getBody()))
  
  //     .catch(err => 
  //       assert.isObject(err),
  //       assert.equal(err.getStatusCode(), 200),
  //       assert.isObject(err.getBody()))
      

  // });

  it('should throw an error if using a non esisting reference', () => {
    const wrongReference = 'Ou5Eppowe2dvkYlR';

    return client.delete(`transaction-schedule/${wrongReference}`)
      .then(res => res)
      .catch(e =>
        e.should.be.instanceOf(Response) &&
        assert.equal(e.getStatusCode(), 404) &&
        assert.isObject(e.getBody())
      );
  });

});
