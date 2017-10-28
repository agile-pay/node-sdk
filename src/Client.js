'use strict';

const axios = require('axios');
const https = require('https');
const { stringify } = require('querystring');
const { createHmac } = require('crypto');

const { internal } = require('./utils');
const { Response } = require('./Response');

const _sign = Symbol('sign');
const _request = Symbol('request');
const _validateConfig = Symbol('validateConfig');

const ENVIRONMENT_LOCAL = 'local';
const ENVIRONMENT_TESTING = 'testing';
const ENVIRONMENT_PRODUCTION = 'production';

let _baseUris = {};
_baseUris[ENVIRONMENT_LOCAL] = 'https://api.agilepay.dev/v1/';
_baseUris[ENVIRONMENT_TESTING] = 'https://api.agilepay.dev/v1/';
_baseUris[ENVIRONMENT_PRODUCTION] = 'https://api.agilepay.io/v1/';

/**
 * @typedef {Object} Client
 *
 * Agile Pay client
 */
module.exports = class Client {

  /**
   * Agile Pay client
   *
   * @param {Object} config The configuration
   */
  constructor(config) {
    internal(this).config = config;

    // If the environment is missing let's default it to production
    if (!internal(this).config.hasOwnProperty('environment')) {
      internal(this).config['environment'] = ENVIRONMENT_PRODUCTION;
    }

    this.setConfig(internal(this).config);
  };

  // public methods

  /**
   * Set the configuration
   *
   * @param {Object} config
   */
  setConfig(config) {
    internal(this).config = Object.assign({}, config, { 'retries': 3 });
    this[_validateConfig](internal(this).config);
  };

  /**
   * Get the configuration
   *
   * @returns {Object} config Object
   */
  getConfig() {
    return internal(this).config;
  };

  /**
   * Makes a GET request
   *
   * @param {String} uri request uri
   * @param {Object} options The request options
   * @returns {Promise.<Object>}
   */
  get(uri, options = {}) {
    return this[_request]('get', uri, options);
  }

  /**
   * Makes a PUT request
   *
   * @param {String} uri request uri
   * @param {Object} options The request options
   * @returns {Promise.<Object>}
   */
  put(uri, options = {}) {
    return this[_request]('put', uri, options);
  };

  /**
   * Makes a POST request
   *
   * @param {String} uri request uri
   * @param {Object} options The request options
   * @returns {Promise.<Object>}
   */
  post(uri, options = {}) {
    return this[_request]('post', uri, options);
  };

  /**
   * Makes a DELETE request
   *
   * @param {String} uri request uri
   * @param {Object} options The request options
   * @returns {Promise.<Object>}
   */
  delete(uri, options = {}) {
    return this[_request]('delete', uri, options);
  };

  // ********* private methods *********************************** //

  /**
   * Makes the http request
   *
   * @param {String} method
   * @param {String} uri
   * @param {Object} options
   * @returns {Promise.<Object>}
   */
  [_request](method, uri, options) {

    if (options.hasOwnProperty('data') && Object.keys(options.data).length > 0) {
      options['headers'] = {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'Authorization': `AP ${internal(this).config['api_key']}:${this[_sign](method, uri, options.data)}`,
      };
    } else {
      options['headers'] = {
        'Authorization': `AP ${internal(this).config['api_key']}:${this[_sign](method, uri, '')}`,
      };
    }

    if (options.hasOwnProperty('params')) {
      options['paramsSerializer'] = options => stringify(options.params);
    }

    options.headers['User-Agent'] = 'agile-pay/node';

    if (internal(this).config['environment'] !== ENVIRONMENT_PRODUCTION) {
      options.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
    }

    options.method = method;
    options.url = `${_baseUris[ internal(this).config['environment'] ]}${uri}`;
    options.responseType = 'json';

    return axios(options)
      .then(res => Promise.resolve(new Response(res)))
      .catch(err => Promise.reject(new Response(err.response)));
  };

  /**
   * Signs the request
   *
   * @param {String} method
   * @param {String} uri
   * @param {String} body
   * @returns {String}
   */
  [_sign](method, uri, body = {}) {
    const concatenated = `${method.toUpperCase()
    }${_baseUris[internal(this).config['environment']]}${uri}${
      Object.keys(body).length > 0 ? JSON.stringify(body) : ''
    }${Math.floor(new Date().getTime() / 1000)}`;

    const hmac = createHmac('sha256', internal(this).config['api_secret']);
    const signed = hmac.update(Buffer.from(concatenated).toString('base64')).digest('hex');

    return signed;
  };

  /**
   * Checks if config Object is valid
   *
   * @param {Object} config the config Object
   */
  [_validateConfig](config) {
    const requiredFields = [ 'api_key', 'api_secret' ];
    requiredFields.forEach(field => {
      if (!config.hasOwnProperty(field)) throw new Error(`Missing required configuration field : ${field}`);
    });

    if (config.hasOwnProperty('max_fail_retries') && typeof config['max_fail_retries'] !== 'number' && config['max_fail_retries'] < 0) {
      throw new Error('Invalid max_fail_retries, it must be positive integer');
    }
  };

};
