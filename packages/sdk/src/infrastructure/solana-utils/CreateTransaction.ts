import { PrepareTransaction } from '@heliofi/common';
import { Message, Transaction } from '@solana/web3.js';

export function createTransaction(
  prepareTransactionResponse: PrepareTransaction
): Transaction {
  const message = Message.from(
    Buffer.from(JSON.parse(prepareTransactionResponse.transactionMessage).data)
  );

  return Transaction.populate(message);
}
