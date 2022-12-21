import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Keypair, Transaction } from '@solana/web3.js';
import nacl from 'tweetnacl';

export async function signTransaction(
  pTransaction: Transaction,
  wallet: AnchorWallet,
  otherSigner?: Keypair
): Promise<string> {
  try {
    const transaction: Transaction = pTransaction;
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
  } catch (error) {
    return String(error);
  }
}
