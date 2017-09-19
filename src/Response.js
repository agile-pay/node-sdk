'use strict';

const { internal } = require('./utils');

/**
 * @typedef {Object} Response
 *
 * Agile Pay Response
 */
module.exports = class Response {

  /**
   * Agile Pay Response
   * @param {Object} response The entire http response
   */
  constructor(response) {
    internal(this).response = response;
  }

  /**
   * Retrieve the actual response
   * @returns {Object} response object
   */
  getRaw() { return internal(this).response; }

  /**
   * @returns {Object} response body
   */
  getBody() { return internal(this).response.data; }

  /**
   * @returns {Number} response status code
   */
  getStatusCode() { return internal(this).response.status; }

};
