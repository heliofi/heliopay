## Installation

`yarn add @heliofi/react`

## Embed Helio Components

You can embed Helio components for the following 2 use cases:

* Embed a Pay Link or Pay Stream with the Helio Pay button (REACT)
* Embed a Dynamic payment with the Helio Pay button (REACT)

### 1. Embed a Pay Link or Pay Stream with the Helio Pay button

Use this option if you want to put the Helio Pay Button on your site for Links and Streams

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

### 2. Embed a Dynamic payment with the Helio Pay button

The Helio pay button also supports a "dynamic" payment options where you can pass a currency and a value through to our standard Helio Pay button.
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

Verify the payment using the Helio API - further details at https://docs.hel.io/developers/helio-api-key
Devnet and Mainnet are currently supported.

For full details of our API schema please review https://docs.hel.io/developers/detailed-api-schema

Once you have access to the API you can call the endpoint per the following example:

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

An example application with dynamic pricing can be found here: [embedded button example app.](https://heliopay-nextjs-sample-twefx01p8-heliofi.vercel.app/)
