import { Wallet } from '@project-serum/anchor';
import { Connection, Transaction } from '@solana/web3.js';

export async function signTransaction(
  transaction: Transaction,
  wallet: Wallet,
  connection: Connection
): Promise<string> {
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  const signedTransaction = await wallet.signTransaction(transaction);

  return JSON.stringify(signedTransaction.serialize());
}
