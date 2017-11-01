'use strict';
const { parse } = require('url');
const { internal } = require('./utils');

const _extrapolateUri = Symbol('extrapolateUri');

/**
 * @typedef {Object} Response
 *
 * Agile Pay Response
 */
class Response {

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

/**
 * @typedef {Object} PaginatedResponse
 *
 * Agile Pay PaginatedResponse
 */
class PaginatedResponse {

  /**
   * Agile Pay Response
   * @param {Object} client Agile Pay client
   * @param {Object} response The entire http response
   */
  constructor(client, response) {
    internal(this).client = client;
    internal(this).response = response;
  }
  /**
   * @returns {Object} returns the raw response object
   */
  getResponse() {
    return internal(this).response;
  }

  /**
   * @returns {Object} returns the paginated response data excluding pagination information
   */
  getData() {
    return internal(this).response.getBody()['data'];
  }

  /**
   * @returns {Number} returns the total number of items
   */
  totalItems() {
    return Number(internal(this).response.getBody()['total']);
  }

  /**
   * @returns {Number} retrieves the current page
   */
  currentPage() {
    return Number(internal(this).response.getBody()['current_page']);
  }

  /**
   * @returns {Number} returns the total number of pages
   */
  totalPages() {
    return Number(internal(this).response.getBody()['last_page']);
  }

  /**
   * @returns {Boolean} checks whether the current page is the last page
   */
  isLastPage() {
    return this.currentPage() === this.totalPages();
  }

  /**
   * @returns {Object} fetches the next page data
   */
  nextPage() {
    if (this.currentPage() < this.totalPages() && internal(this).response.getBody().hasOwnProperty('next_page_url')) {
      const url = internal(this).response.getBody()['next_page_url'];

      if (url.length > 0) { // has to be double checked
        internal(this).response = internal(this).client.get(this[_extrapolateUri](url));
        return this;
      }

      throw new Error(`You can't go forward any further`);
    }
  }

  /**
   * @returns {Object} etches the previous page data
   */
  previousPage() {
    if (this.currentPage() > 1 && internal(this).response.getBody().hasOwnProperty('prev_page_url')) {
      const url = internal(this).response.getBody()['prev_page_url'];

      if (url.length > 0) { // has to be double checked
        internal(this).response = internal(this).client.get(this[_extrapolateUri](url));
        return this;
      }

      throw new Error(`You can't get back any further`);
    }
  }

  [_extrapolateUri](url) {
    const parsedUrl = parse(url);
    const path = parsedUrl.pathname.substring(4);
    const query = parsedUrl.query;

    return query.length > 0 ? `${path}?${query}` : path;
  }

};

module.exports = { Response, PaginatedResponse };
