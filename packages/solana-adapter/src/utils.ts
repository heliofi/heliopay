import { Wallet } from '@project-serum/anchor/dist/cjs/index';
import { Connection, Transaction, Keypair } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export async function signTransaction(
  transaction: Transaction,
  wallet: AnchorWallet,
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
