require('dotenv').config()

const AgilePay = require('../src/AgilePay')

const agilePay = new AgilePay({
  api_key : 'key',
  api_secret : 'secret'
})

async function response() {
  const res = await agilePay.gateway().create('test', { dummy_key : 'dummy' })
  console.log(res);
}

response();