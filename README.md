## Installation

`yarn add @heliofi/react`

## Components

### 1. HelioPay

A container that fetches payment information as well as performs payment on Solana blockchain validates it via Helio API.

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

### 2. Dynamic payment with embedded button

Heliopay button also supports dynamic payment options where you can use embedded button in carting for example.
In the example below if you provide totalAmount and the currency to the button, the user will perform the payments with those specifications.

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

You can verify the payment using helio api for development and for production accordingly:
`https://dev.api.hel.io` and `https://api.hel.io`.

In order to validate the payment you need to register your public key with Helio team, and you will receive api secret token.
After which call the endpoint like in the example below:

```ts
try {
  const transactionSignature = "solana blockchain transaction signature";
  const token = "token from helio team";
  const publicKey =
    "you public key registered with helio team that recives transacitons";

  const baseUrl = "https://dev.api.hel.io";
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

The example above shows verification process for devnet, you can replace the base url with `https://api.hel.io` for prod.

### 3. Dynamic payment without embedded button

If you choose to not use embedded button you can still use Helio api for registering payment.
Please note that the blockchain transaction has to go through our smart contract. In order to achieve that you can use our @heliofi/solana-adapter package.
Example:

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
  provider: Program<HelioIdl>
): Promise<string | undefined> => {
  const isHelioX = true; // The transaction is also checked on the backend to verify if the user is a heliox member or not
  try {
    if (symbol === "SOL") {
      return await singleSolPayment(provider, request, !isHelioX);
    }
    return await singlePayment(provider, request, !isHelioX);
  } catch (e) {
    // hangle error
  }
};

const signature = await sendTransaction(
  symbol,
  {
    amount,
    sender: anchorProvider.provider.publicKey as PublicKey,
    recipient: new PublicKey(recipientPK),
    mintAddress: new PublicKey(mintAddress),
    cluster,
  },
  anchorProvider
);
```

The signature for SinglePaymentRequest looks as follows:

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

After performing the transaction you can proceed by submitting it to our api.
For that you can directly call our `approve-transaction` api endpoint with request body as follows.

Approve transaction request body has the following signature:

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
If the transaction has status confirmed or finalized the API will return success, otherwise will throw one of the following error codes.

`HTTP 400` - invalid request body

`HTTP 424` - transaction not confirmed on blockchain

If the transaction is valid the return object has the following signature:

`HTTP 200`

```ts
{
  content: string;
}
```

The secret content that is revealed upon valid payment.

### Retry logic

If you get the error `HTTP 424` you can resubmit the transaction again with interval before it's accepted.
Below is an example of using retry logic:

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
