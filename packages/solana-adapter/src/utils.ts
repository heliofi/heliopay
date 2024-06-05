import * as nacl from 'tweetnacl';
import { Connection, Transaction, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { CurrencyTokenProgram } from '@heliofi/common';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

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

export function getProgramId(
  currencyTokenProgram: CurrencyTokenProgram | undefined
): PublicKey {
  // Safe to have a fallback to TOKEN_PROGRAM_ID, in case of undefined
  return currencyTokenProgram === CurrencyTokenProgram.TOKEN2022
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;
}
