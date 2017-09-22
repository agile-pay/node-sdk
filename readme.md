# AgilePay Node.js SDK

The AgilePay Node node.js SDK provides a convenient access to the AgilePay API from
applications written in server-side JavaScript.

This package is promise based with promises in mind instead of callback approach.

You can use the `promise` style or `async` `await` style.

Please keep in mind that this package is for use with server-side Node that
uses AgilePay secret keys. This package should not be used on the client side.
Also note that this package is still in development.

## Documentation

See the [Node API docs](http://docs.agilepay.io/#!/introduction).

## Installation

Install the package with:

    npm install agile-pay --save

## Usage
  * Register for an account and get your key and secret at [AgilePay](mailto:support@agilepay.io).
  * Add dependency 'agile-pay' in your package.json file.
  * Require 'agile-pay' in your file

``` js
const agilePay = require('agile-pay')

const client = new agilePay({
  'api_key': 'key',
  'api_secret': 'secret'
});
```

## Gateways

#### To create a new gateway :

`promise` example:
``` js
agilePay.gateway().create('stripe', { 'secret_key': 'stripe-secret-key' })
  .then(res => res.getBody())
  .catch(err => err.getStatusCode()));
```

`async` `await` examples:
``` js
(async function () {
  try {
    const response = await agilePay.gateway().create('stripe', { 'secret_key': 'stripe-secret-key' });
    console.log(response.getStatusCode());
  } catch (error) {
    console.log(error.getStatusCode());
  }
})();
```
or

``` js
async function gateway() {
  try {
    const response = await agilePay.gateway().create('stripe', { 'secret_key': 'stripe-secret-key' });
    console.log(response.getStatusCode());
  } catch (error) {
    console.log(error.getStatusCode());
  }
}

gateway();
```

## Payment methods

#### To create a new payment method type of gateway token:

In this case the payment method will be retained with the provided gateway,
please check the availability of transaction store in the gateways

Gateways list -> http://docs.agilepay.io/#!/gateway

Gateway token -> http://docs.agilepay.io/#!/payment-method-create-gateway-token

`promise` example:
``` js
agilePay.paymentMethod().createGatewayToken('gateway-reference', {
  number: '4111111111111111',
  expiry_year: 17,
  expiry_month: 12,
  cvv: 123,
  holder_name: 'John Smith',
})
  .then(res => res.getBody().token)
  .catch(res => {
  // something went wrong
  });
```

`async` `await` examples:
``` js
(async function () {
  try {
    const gatewayToken = await agilePay.paymentMethod().createGatewayToken('gateway-reference', {
      number: '4111111111111111',
      expiry_year: 17,
      expiry_month: 12,
      cvv: 123,
      holder_name: 'John Smith',
    });

// The response will contain a payment method **token** which is used to perform transactions against the payment method
  const token = gatewayToken.getBody().token;

  } catch (err) {
    // something went wrong
  }
})();
```
or

``` js
async function gatewayToken() {
  try {
    const gatewayToken = await agilePay.paymentMethod().createGatewayToken('gateway-reference', {
      number: '4111111111111111',
      expiry_year: 17,
      expiry_month: 12,
      cvv: 123,
      holder_name: 'John Smith',
    });

// The response will contain a payment method **token** which is used to perform transactions against the payment method
    const token = gatewayToken.getBody().token;
    return token;

  } catch (err) {
    // something went wrong
  }
}

gatewayToken();
```


## Transactions

#### Auth (Charge a credit card with a payment method type of gateway token):

`promise` example:
``` js
agilePay.transaction()
  .setGateway('gateway-reference')
  .setPaymentMethod('payment-method-token')
  .auth(5000, 'GBP')
  .then(res => {

    if (res.getBody().successful) {
      // the authorisationwas successful
    } else {
      // the gateway responded with some errors
      res.getBody().errors;
    }

  })
  .catch(res => {
  // something went wrong
  });

```
`async` `await` example:
``` js
async function transactionReference() {
  try {
    const transaction = await agilePay.transaction()
    .setGateway('gateway-reference')
    .setPaymentMethod('payment-method-token')
    .auth(5000, 'GBP');

    if (transaction.getBody().successful) {
      const transaction = transaction.getBody().successful;
      return transaction;
    } else {
      const error = transaction.getBody().errors;
      return error
    }

  } catch (err) {
    // something went wrong
  }
}

// The response will contain a **reference** which can be used for second steps transactions such as **void**, **capture** and **refund**
transactionReference();
```


#### Void (Cancel an authorized transaction):
``` js
agilePay.transaction('authorised-transaction-reference').void()
  .then(res => {
    if (res.getBody().successful) {
    // the pre-authorisation has been successfully cancelled
    }
  }).catch(res => {
  // something went wrong
  });
```

#### Capture (Settle an authorized transaction):
``` js
agilePay.transaction('authorised-transaction-reference').capture()
  .then(res => {
    if (res.getBody().successful) {
    // the pre-authorisation has been successfully cancelled
    }
  }).catch(res => {
  // something went wrong
  });
```

#### Credit (Refund a settled transaction):
``` js
agilePay.transaction('authorised-transaction-reference').credit()
  .then(res => {
    if (res.getBody().successful) {
    // the pre-authorisation has been successfully cancelled
    }
  }).catch(res => {
  // something went wrong
  });
```

### Response methods

Below the response object available methods.

##### getRaw()
Retrieves the entire response

##### getBody()
Retrieves the response body

##### getStatusCode()
Retrieves the response status code

## Credits
A big thanks to [Ary Homebrew](https://github.com/cryst10) for the huge contribution he has given to this package.