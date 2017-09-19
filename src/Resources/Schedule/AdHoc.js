'use strict';

const { internal } = require('../../utils');

/**
 * @typedef {Object} AdHoc
 * AgilePay AdHoc
 */
module.exports = class AdHoc {

  /**
   * AgilePay AdHoc
   *
   * @param {Object} client
   * @param {String} reference
   */
  constructor(client, reference = null) {
    internal(this).client = client;
    internal(this).reference = reference;
  }

  /**
   * Creates a new schedule of type ad_hoc
   *
   * @param {Object} fields
   * @return {Promise.<Object>} response object
   */
  create(fields) {
    return internal(this).client.post('schedules',
      {
        'data': Object.assign({}, fields, { 'type': 'ad_hoc' })
      });
  };

};
