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
async function response() {
  try {
    const response = await agilePay.gateway().create('stripe', { 'secret_key': 'stripe-secret-key' });
    console.log(response.getStatusCode());
  } catch (error) {
    console.log(error.getStatusCode());
  }
}

response();
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
A big thanks to [Peres Nimarico](https://github.com/cryst10) for the huge contribution he has given to this package.