import {
  ComputeBudgetProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js';

export function getTransaction(ix: TransactionInstruction): Transaction {
  const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1000000,
  });

  return new Transaction().add(modifyComputeUnits).add(ix);
}
