import { IDL, PROGRAM_ID } from '@heliofi/solana-adapter';
import { Program, Provider } from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { ConfirmOptions } from '@solana/web3.js';
import React, { FC, ReactNode, useMemo } from 'react';
import { AnchorContext } from './AnchorContext';

const opts: ConfirmOptions = {
  preflightCommitment: 'processed',
};

/**
 * Will return an anchor provider pointing to the Solana's program that we use.
 *
 * Sources:
 *      https://github.com/faktorfi/faktor/blob/main/apps/list-program-demo/components/WalletConnectionProvider.tsx
 *      https://github.com/solana-labs/wallet-adapter
 *      https://lorisleiva.com/create-a-solana-dapp-from-scratch/integrating-with-solana-wallets
 */
export const AnchorProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const programProvider = useMemo(() => {
    if (!wallet) return null;
    const provider = new Provider(connection, wallet, opts);

    return new Program<any>(IDL, PROGRAM_ID, provider);
  }, [wallet, connection]);

  return (
    <AnchorContext.Provider value={programProvider}>
      {children}
    </AnchorContext.Provider>
  );
};
