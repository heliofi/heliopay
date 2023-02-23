## Introduction

Helio embedded components can be used in your website for dynamic payments or standard paylinks and pay streams.

We currently support React v18.

Download the NPM from here: https://www.npmjs.com/package/@heliofi/react

(Use the latest full version modules for deployment. Do not use the alpha versions unless recommended by Helio)

Always use the latest public version and ensure that all your dependencies are on the latest versions

Helio uses Swagger for API testing where you can review API endpoints and review examples: https://api.hel.io/v1/docs

We recommend that you use Swagger to get familiar with the APIs and for testing payloads

For full details of our API schema please review https://docs.hel.io/developers/detailed-api-schema

Further documents with examples are available here: https://github.com/heliofi/heliopay/tree/main/docs

Devnet and Mainnet are currently supported by Helio.

## Installation

`yarn add @heliofi/react`

## Embed Helio Components

You can embed Helio components for the following two use cases:

* Embed a Dynamic payment with the Helio Pay button (REACT)
* Embed a Pay Link or Pay Stream with the Helio Pay button (REACT)

### 1. Embed a Dynamic payment with the Helio Pay button

The Helio pay button supports a "dynamic" payment options where you can pass a currency and a value through to our standard Helio Pay button.
This is useful for custom checkout pages that want to have more than one item on the page where a total can be calculated and passed through for payment.

In the example below if you provide totalAmount and the currency to the button, the user will perform the payments with those values.

```ts
import { HelioPay } from "@heliofi/react";

const App = () => {
  return (
    <div>
      <HelioPay
        cluster="mainnet-beta"
        paymentRequestId={"your_paylink_id"}
        supportedCurrencies={["SOL"]}
        totalAmount={0.01}
        onSuccess={(event: SuccessPaymentEvent): void => {
          console.log("onSuccess", event);
          /**
           * The success event signature looks as follows:
           * {
           *    content: string;
           *    transaction: string;
           * }
           * The transaction can be used to verify the payment with helio api
           * */
        }}
      />
    </div>
  );
};
```

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
### 2. Embed a Pay Link or Pay Stream with the Helio Pay button

Use this option if you want to embed the Helio Pay Button on your site for Links and Streams

```ts
import { HelioPay } from "@heliofi/react";

const App = () => {
  return (
    <div>
      <HelioPay
        cluster="mainnet-beta"
        paymentRequestId={"your_paylink_id"}
        onSuccess={function (event: SuccessPaymentEvent): void {
          console.log("onSuccess", event);
        }}
        onError={function (event: ErrorPaymentEvent): void {
          console.log("onError", event);
        }}
        onPending={function (event: PendingPaymentEvent): void {
          console.log("onPending", event);
        }}
        onStartPayment={function (): void {
          console.log("onStartPayment");
        }}
      />
    </div>
  );
};
```
#### Properties table for the Helio components

| Property         | Type     | Required | Default value | Description                                                                                |
| :--------------- | :------- | :------- | :------------ | :----------------------------------------------------------------------------------------- |
| cluster          | string   | yes      |               | **available values;** devnet, mainnet-beta, testnet                                        |
| paymentRequestId | string   | yes      |               | Your paylink ID                                                                            |
| onSuccess        | function | no       |               | triggered event when success                                                               |
| onError          | function | no       |               | triggered event when error                                                                 |
| onPending        | function | no       |               | triggered event when pending                                                               |
| onStartPayment   | function | no       |               | triggered event on start payment                                                           |
| theme            | object   | no       |               | customize the primary color(more will come soon) `theme={{ colors: { primary: #f76c1b }}}` |
totalAmount | number | no | | you can pass dynamic amount. dynamic pricing should be checked for this. |
| supportedCurrencies | string array | no | | currencies you want to support.

### Support Currencies

Use our Swagger API to get a list of currencies currently supported : https://api.hel.io/v1/docs#/Currency/CurrencyController_value

Try it out with currency 'type' of "DIGITAL" to return all supported currencies

Or pull directly from : https://api.hel.io/v1/currency?type=DIGITAL

### Embedded Example App

An example application with dynamic pricing can be found here: [Embedded Example App](https://embed.hel.io/)

Repo for the example application which you can review to understand how to embed Helio components : https://github.com/heliofi/heliopay-nextjs-sample

<img width="983" alt="Helio Embedded Example App" src="https://user-images.githubusercontent.com/97976151/213204178-1dd385db-00f0-4978-b26c-ba1fefe56d2c.png">
