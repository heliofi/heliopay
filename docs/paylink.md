> Create helio transaction via API

Every transaction in Helio has associated payment request id (prId).
There are 3 different types of payment requests, paylink, stream and invoice.
Each pr can be created in helio dashboard, by logging in.
After which you will have a checkout URL with the prId.


This example will focus on paylinks, but the same can be applied to other types of payment requests.
Each transaction flow has 3 stages.
- Preparation: user requests transaction object which contains blockchain instructions defined by our smart contract
- Signing: the user signs the transaction with self custody wallet
- Submission: after signing the user submits the transaction to API which in turn will validate and submit the transaction to blockchain with retry and confirm mechanism to make sure the transaction is valid.

For prepare and submit we have an endpoint where you can obtain transaction sign and submit.

### Paylink prepare

Endpoint:
```shell
https://api.hel.io/v1/prepare/transaction/sol/paylink
```

Method:
```shell
[POST]
```
Request payload:
```typescript
export class PrepareTransactionDto {
  paymentRequestId: string;
  sender: string;
  currency: string;
  amount: string;
  quantity: number;
  fixedCurrencyRateToken?: string;
}
```
As you can see there are only mandatory fields for prepare endpoint to create a transaction.

This endpoint then returns a payload if everything is valid in the request:
```typescript
export class PrepareTransaction {
  // JWT that signs and contains information for transaction session
  transactionToken: string;
  // The blockchain instractions that can be signed in the front end
  transactionMessage: string;
}
```

### Paylink sign transaction
In order to sign a transaction we need to reconstruct the transaction.
```typescript
import { Message, Transaction } from '@solana/web3.js';

export function createTransaction(
  transactionMessage: string
): Transaction {
  const message = Message.from(
    Buffer.from(JSON.parse(transactionMessage).data)
  );

  return Transaction.populate(message);
}
```
After which you can sign the transaction, there are many ways to do it, but if you are in a browser, you can use AnchorWallet, which is the main Solana wallet adapter.
```typescript
// wallet comes from: import { AnchorWallet } from '@solana/wallet-adapter-react';
const signedTransactionObject = await wallet.signTransaction(transaction);
const signedTransaction = JSON.stringify(signedTransactionObject.serialize());
```
### Paylink submit transaction

After we obtain signed transaction, we have the submit step, which is calling API endpoint:
Endpoint:
```shell
https://api.hel.io/v1/transaction/submit
```
Method:
```shell
[POST]
```
Payload:
```typescript
export class SubmitTransactionDto {
  signedTransaction: string; // signed in the previous step
  paymentRequestId: string; // PR id you get from dash
  quantity: number; // use 1 
  currency: string; // you get it from paylink
  transactionToken: string; // you get this from prepare endpoint
}
```
The request should contain the following payload parameters:

After submitting the transaction and if the validity is correct you will get back the following payload:
```typescript
interface Submit {
  content: {
    text?: string;
    imageUrl?: string;
  };
  transactionSignature?: string;
}
```
You can verify the transaction signature on the blockchain.
