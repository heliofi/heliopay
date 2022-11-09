import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BN, Program } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { HelioIdl } from './program';
import { TopupRequest } from './types';
import { signTransaction } from './utils';

export const getTopupSignedTx = async (
  connection: Connection,
  wallet: AnchorWallet,
  program: Program<HelioIdl>,
  req: TopupRequest
): Promise<string> => {
  const [pda] = await PublicKey.findProgramAddress(
    [req.payment.toBytes()],
    program.programId
  );
  const mint = req.mintAddress!;

  const senderTokenAccount = await getAssociatedTokenAddress(mint, req.sender);

  const paymentTokenAccount = await getAssociatedTokenAddress(
    mint,
    req.payment
  );

  const transaction = await program.methods
    .topup(new BN(req.amount))
    .accounts({
      sender: req.sender,
      senderTokenAccount,
      paymentAccount: req.payment,
      paymentTokenAccount,
      pdaSigner: pda,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .transaction();

  return signTransaction(transaction, wallet, connection);
};
