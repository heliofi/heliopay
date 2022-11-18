## Installation

`yarn add @heliofi/react`

## Embed Helio Components

You can embed Helio components for the the following 3 use cases:

* Embed a Pay Link or Pay Stream with the Helio Pay button (REACT)
* Embed a Dynamic payment with the Helio Pay button (REACT)
* Process Dynamic payments WITHOUT the Helio Pay button (used in your own cart application)

### 1. Embed a Pay Link or Pay Stream with the Helio Pay button

Use this option if you want to put the Helio Pay Button on your site for Links and Streams

```ts
import { HelioPay } from "@heliofi/react";

const App = () => {
  return (
    <div>
      <HelioPay
        cluster="devnet"
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
        cluster="devnet"
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

### 3. Process Dynamic payments WITHOUT the Helio Pay button

If you wish to build your own checkout cart or app then you can pass values through to Helio Pay without using the pay button at all.
This option is best for existing sites that have a custom checkout already or you want to build the best experience for your site.

Please note that the blockchain transaction has to go through our smart contract. In order to achieve that you can use our @heliofi/solana-adapter package.

Here is an example of what is required for this option:

```ts
import {
  HelioIdl,
  SinglePaymentRequest,
  singlePayment,
  singleSolPayment,
} from "@heliofi/solana-adapter";
import { Cluster, PublicKey } from "@solana/web3.js";

const sendTransaction = async (
  symbol: string,
  request: SinglePaymentRequest,
  provider: Program<HelioIdl>,
  isHelioX: boolean,
): Promise<string | undefined> => {
  try {
    if (symbol === "SOL") {
      return await singleSolPayment(provider, request, !isHelioX);
    }
    return await singlePayment(provider, request, !isHelioX);
  } catch (e) {
    // hangle error
  }
};


const checkHelioX = async (
  recipientPK: string,
): Promise<{ isHelioX: boolean }> => {
  const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
  const res = await fetch(`${HELIO_BASE_API_URL}/v1/wallet/${recipientPK}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
  const result = await res.json();
  if (res.status === HttpCodes.SUCCESS) {
    return {
      isHelioX: result.isHelioX,
    };
  }
  return {
    isHelioX: false,
  };
};


const isHelioX = await checkHelioX(recipientPK) // The transaction is also checked on the backend to verify if the user is a heliox holder


const signature = await sendTransaction(
  symbol,
  {
    amount,
    sender: anchorProvider.provider.publicKey as PublicKey,
    recipient: new PublicKey(recipientPK),
    mintAddress: new PublicKey(mintAddress),
    cluster,
  },
  anchorProvider,
  isHelioX
);
```

The signature returned for a SinglePaymentRequest will look as follows:

```ts
import { Cluster, PublicKey } from "@solana/web3.js";

export type SinglePaymentRequest = {
  amount: number;
  sender: PublicKey;
  recipient: PublicKey;
  mintAddress: PublicKey;
  cluster: Cluster;
};
```

After performing the transaction you can proceed by submitting it to our API

For that you can directly call our Submit Transaction API endpoint (POST: /v1/transaction/submit) with the request body as follows:

```ts
export interface ApproveTransactionPayload {
  transactionSignature: string;
  paymentRequestId: string;
  amount: number;
  sender: string;
  recipient: string;
  currency: string;
  cluster: Cluster;
  customerDetails?: CustomerDetails;
  quantity?: number;
  productDetails?: {
    name?: string;
    value?: string;
  };
}
```

```ts
const approveTransaction = async (
  reqBody: ApproveTransactionPayload
): Promise<Response> => {
  const res = await fetch(`${getHelioApiBaseUrl()}/approve-transaction`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  return res;
};

const usdcCoefficient = 1000000;
const amount = 0.1 * usdcCoefficient; // in this case you are paying 0.1 USDC

approveTransaction({
  transactionSignature: signature,
  paymentRequestId: "test request id",
  amount: amount,
  sender: "sender_id",
  recipient: "recipient_id",
  currency: "USDC",
  cluster: "devnet",
  quantity: 1,
});
```

Please note that the API will check with the blockchain to validate the signature of the transaction.
If the transaction has status confirmed or finalized the API will return success, otherwise it will throw one of the following error codes.

`HTTP 400` - invalid request body

`HTTP 424` - transaction not confirmed on blockchain

If the transaction is valid the return object has the following signature:

`HTTP 200`

```ts
{
  content: string;
}
```

For example, if the 'content' value was required, this is revealed upon valid payment.

### Retry logic

If you get the error `HTTP 424` you can resubmit the transaction again with interval before it's accepted.

Below is an example of using the retry logic:

```ts
export class VerificationError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, VerificationError.prototype);
  }
}

const retryCallback = async (
  callback: () => Promise<void>,
  count: number,
  delay: number,
  onError: (message: string) => void
): Promise<void> => {
  if (count < 0) {
    onError("Unable to verify the transaction.");
    return;
  }
  try {
    await callback();
  } catch (e) {
    if (e instanceof VerificationError) {
      setTimeout(async () => {
        await retryCallback(callback, count - 1, delay, onError);
      }, delay);
    } else {
      onError(String(e));
    }
  }
};

await retryCallback(
  async () => {
    const content = await approveTransaction(approveTransactionPayload);
    console.log(content); // Success
  },
  20, // retry 20 times
  5_000, // retry every 5 seconds
  (e) => console.error(e)
);

const approveTransaction = async (
  reqBody: ApproveTransactionPayload
): Promise<string> => {
  const HELIO_BASE_API_URL = getHelioApiBaseUrl(reqBody.cluster);
  const res = await fetch(`${HELIO_BASE_API_URL}/approve-transaction`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(reqBody),
  });
  const result = await res.json();
  if (res.status === HttpCodes.SUCCESS && result.content != null) {
    return result.content;
  }
  if (res.status === HttpCodes.FAILED_DEPENDENCY) {
    throw new VerificationError(result.message);
  }
  throw new Error(result.message);
};

export enum HttpCodes {
  SUCCESS = 200,
  NOT_FOUNT = 404,
  BAD_REQUEST = 400,
  FAILED_DEPENDENCY = 424,
}
```

You can find the full code example in [TransactionService.ts](https://github.com/heliofi/heliopay/blob/main/packages/react/src/infrastructure/solana-adapter/TransactionService.ts)

An example application with dynamic pricing can be found here: [embedded button example app.](https://heliopay-nextjs-sample-twefx01p8-heliofi.vercel.app/)
