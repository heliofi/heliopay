import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { HelioIdl } from './program';
import { TopupRequest } from './types';
import { signTransaction } from './utils';

export const getTopupSolSignedTx = async (
  connection: Connection,
  wallet: AnchorWallet,
  program: Program<HelioIdl>,
  req: TopupRequest
): Promise<string> => {
  const transaction = await program.methods
    .topupSol()
    .accounts({
      sender: req.sender,
      solPaymentAccount: req.payment,
    })
    .transaction();

  return signTransaction(transaction, wallet, connection);
};
