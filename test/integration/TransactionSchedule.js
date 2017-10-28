// 'use strict';

// const chai = require('chai');
// const assert = chai.assert;
// const should = chai.should();
// require('dotenv').config();

// const Client = require('../../src/Client');
// const Gateway = require('../../src/Resources/Gateway');
// const TransactionSchedule = require('../../src/Resources/TransactionSchedule');
// const PaymentMethod = require('../../src/Resources/PaymentMethod');

// beforeEach(async () => {
//   const config = {
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
//   };

//   this.client = new Client(config);
//   this.transactionSchedule = new TransactionSchedule(this.client);

//   this.card = await new PaymentMethod(this.client).createCard({
//     'cvv': '123',
//     'number': '4111111111111111',
//     'holder_name': 'Mario Rossi',
//     'expiry_year': '17',
//     'expiry_month': '12',
//   });

//   this.gatewayToken = async function (fromExisting = false) {
//     const gateway = await new Gateway(this.client).create('test', { 'dummy_key': 'dummy' });
//     const reference = gateway.getBody()['reference'];

//     if (!fromExisting) {
//       const pm = await new PaymentMethod(this.client).createGatewayToken(reference, {
//         'cvv': '123',
//         'number': '4111111111111111',
//         'holder_name': 'Mario Rossi',
//         'expiry_year': '17',
//         'expiry_month': '12',
//       });
//       return pm;
//     }
//     const card = this.card.getBody()['token'];
//     const pmO = await new PaymentMethod(this.client, card).createGatewayToken(reference);
//     return pmO;
//   };

//   this.token = await this.gatewayToken();
//   await this.transactionSchedule.setPaymentMethod(this.token.getBody()['token']);

//   this.scheduleAuth = async function () {

//     const today = new Date();
//     const at = new Date(today.setDate(today.getDate() + 15));
//     const at5 = new Date(today.setDate(today.getDate() + 5));
//     const at10 = new Date(today.setDate(today.getDate() + 10));
//     const at15 = new Date(today.setDate(today.getDate() + 15));

//     const type = 'auth';
//     const timezone = 'Europe/Rome';

//     const schedule = await this.transactionSchedule.schedule(
//       type,
//       `${at.getFullYear()}-${at.getMonth() + 1}-${at.getDay()} ${at.getHours()}:${at.getMinutes()}:${at.getSeconds()}`,
//       timezone,
//       { 'amount': 500, 'currency_code': 'GBP' },
//       [
//         `${at5.getFullYear()}-${at5.getMonth() + 1}-${at5.getDay()} ${at5.getHours()}:${at5.getMinutes()}:${at5.getSeconds()}`,
//         `${at10.getFullYear()}-${at10.getMonth() + 1}-${at10.getDay()} ${at10.getHours()}:${at10.getMinutes()}:${at10.getSeconds()}`,
//         `${at15.getFullYear()}-${at15.getMonth() + 1}-${at15.getDay()} ${at15.getHours()}:${at15.getMinutes()}:${at15.getSeconds()}`,
//       ]
//     );

//     return schedule;
//   };
// });

// describe('TransactionSchedule', () => {

//   it('should schedule a transaction to be executed in the future', async() => {
//     const schedule = await this.scheduleAuth();

//     // assert.equal(schedule.getStatusCode(), 200);
//     // assert.isTrue(schedule.getBody().hasOwnProperty('reference'));
//     // assert.isTrue(schedule.getBody().hasOwnProperty('retries'));
//   });

//   // it('should delete a scheduled transaction', async() => {
//   //   const scheduled = await this.scheduleAuth();
//   //   const reference = scheduled.getBody()['reference'];
//   //   const deleted = await new TransactionSchedule(this.client, reference).delete();

//   //   assert.equal(deleted.getStatusCode(), 200);
//   //   // assert.isObject(charge.getBody());
//   //   // assert.isTrue(charge.getBody().hasOwnProperty('reference'));
//   // });

// });
