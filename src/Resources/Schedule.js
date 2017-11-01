'use strict';

const { internal } = require('../utils');
const AdHoc = require('./Schedule/AdHoc');

/**
 * @typedef {Object} Schedule
 * AgilePay Schedule reference
 */
module.exports = class Schedule {

  /**
   * AgilePay Schedule reference
   *
   * @param {Object} client
   * @param {String} reference
   */
  constructor(client, reference = null) {
    internal(this).client = client;
    internal(this).reference = reference;
  }

  /**
   * Returns an Adhoc instance
   *
   * @returns {Object} Adhoc
   */
  adHoc() { return new AdHoc(internal(this).client, internal(this).reference); };

};
