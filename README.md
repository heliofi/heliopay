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

### Using the Helio API to verify a dynamic payment

Verify the payment using the Helio API by creating access keys here: https://docs.hel.io/developers/helio-api-key

Once you have access to the API with the public and secret API keys you can call the endpoint per the following example:

```ts
try {
  const transactionSignature = "solana blockchain transaction signature";
  const token = "token from helio team";
  const publicKey =
    "you public key registered with helio team that recives transacitons";

  const baseUrl = "https://api.hel.io";
  const endpoint = `/v1/transactions/signature/${transactionSignature}?publicKey=${publickey}`;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response.json();
} catch (e) {
  throw new Error("Unable to get transactions data from backend!");
}
```

### Supported Currencies

Use our Swagger API to get a list of currencies currently supported : https://api.hel.io/v1/docs#/Currency/CurrencyController_value

Try it out with currency 'type' of "DIGITAL" to return all supported currencies

Or pull directly from : https://api.hel.io/v1/currency?type=DIGITAL
