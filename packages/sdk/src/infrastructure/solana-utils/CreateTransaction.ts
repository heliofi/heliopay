import { Message, Transaction } from '@solana/web3.js';

export function createTransaction(
  prepareTransactionResponse: any
): Transaction {
  if (prepareTransactionResponse.serializedTransaction != null) {
    return Transaction.from(
      JSON.parse(prepareTransactionResponse.serializedTransaction).data
    );
  }
  const message = Message.from(
    Buffer.from(JSON.parse(prepareTransactionResponse.transactionMessage).data)
  );

  return Transaction.populate(message);
}
