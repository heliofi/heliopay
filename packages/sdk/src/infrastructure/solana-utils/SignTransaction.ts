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
    return '';
  }
}

export async function signSwapTransactions(
  swappedTransaction: Transaction,
  standardTransaction: Transaction,
  wallet: AnchorWallet,
  otherSigner?: Keypair
): Promise<{
  swapSignedTx: string;
  standardSignedTx: string;
}> {
  try {
    const signedTransactions = await wallet.signAllTransactions([
      swappedTransaction,
      standardTransaction,
    ]);
    if (otherSigner) {
      const transactionDataToSign = signedTransactions[1].serializeMessage();

      const otherSignature = nacl.sign.detached(
        transactionDataToSign,
        otherSigner.secretKey
      );
      signedTransactions[1].addSignature(
        otherSigner.publicKey,
        Buffer.from(otherSignature)
      );
    }
    return {
      swapSignedTx: JSON.stringify(signedTransactions[0].serialize()),
      standardSignedTx: JSON.stringify(signedTransactions[1].serialize()),
    };
  } catch (error) {
    throw new Error(String(error));
  }
}
