import * as nacl from 'tweetnacl';
import { Connection, Transaction, Keypair } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export async function signTransaction(
  transactionParam: Transaction,
  wallet: AnchorWallet,
  connection: Connection,
  otherSigner?: Keypair
): Promise<string> {
  const transaction: Transaction = transactionParam;
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getLatestBlockhash()
  ).blockhash;
  const signedTransaction = await wallet.signTransaction(transaction);
  if (otherSigner) {
    const transactionDataToSign = signedTransaction.serializeMessage();

    const otherSignature = nacl.sign.detached(
      transactionDataToSign,
      otherSigner.secretKey
    );
    signedTransaction.addSignature(
      otherSigner.publicKey,
      Buffer.from(otherSignature)
    );
  }
  return JSON.stringify(signedTransaction.serialize());
}
