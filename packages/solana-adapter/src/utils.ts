import { Wallet } from '@project-serum/anchor';
import { Connection, Transaction, Keypair } from '@solana/web3.js';

export async function signTransaction(
  transaction: Transaction,
  wallet: Wallet,
  connection: Connection,
  otherSigner?: Keypair
): Promise<string> {
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  let signedTransaction = await wallet.signTransaction(transaction);
  if (otherSigner) {
    const otherWallet = new Wallet(otherSigner);
    signedTransaction = await otherWallet.signTransaction(signedTransaction);
  }
  return JSON.stringify(signedTransaction.serialize());
}
