## Introduction

Helio embedded components can be used in your website for dynamic payments or standard paylinks and pay streams.

## Helio checkout embed 

If you would like to embed our Pay Links in your webiste, please see [demo.hel.io](https://demo.hel.io) or our new [Helio Checkout React embed widget](https://www.npmjs.com/package/@heliofi/checkout-react).

Our [sample developer app](https://github.com/heliofi/sample-dev-app) shows how to use our API and embed together.

## Helio SDK

The Helio SDK is now integrated into the Helio React modules.

For full details of our SDK and how to use it please review https://github.com/heliofi/heliopay/tree/main/packages/sdk

Helio uses Swagger for API testing where you can review API endpoints and review examples: https://api.hel.io/v1/docs

We recommend that you use Swagger to get familiar with the SDK and APIs and for testing payloads

For full details of our API schema please review https://docs.hel.io/developers/detailed-api-schema

Further documents with examples are available here: https://github.com/heliofi/heliopay/tree/main/docs

Devnet and Mainnet are currently supported by Helio.

### Supported Currencies

Use our Swagger API to get a list of currencies currently supported : https://api.hel.io/v1/docs#/Currency/CurrencyController_value

Try it out with currency 'type' of "DIGITAL" to return all supported currencies

Or pull directly from : https://api.hel.io/v1/currency?type=DIGITAL
