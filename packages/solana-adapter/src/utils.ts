import { Connection, Transaction, Keypair } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export async function signTransaction(
  transaction: Transaction,
  wallet: AnchorWallet,
  connection: Connection
): Promise<string> {
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  let signedTransaction = await wallet.signTransaction(transaction);
  return JSON.stringify(signedTransaction.serialize());
}
