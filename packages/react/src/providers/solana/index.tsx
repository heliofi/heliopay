import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { FC, ReactNode, useMemo } from 'react';
import { ClusterHelio } from '@heliofi/sdk';
import { AddressProvider } from '../address';

import { AnchorProvider } from '../anchor';
import { HelioProvider } from '../helio';
import { getClusterEndpoint } from './clusterEndpoint';
import CheckoutSearchParamsProvider from '../checkoutSearchParams';

export const SolanaProvider: FC<{
  children: ReactNode;
  cluster: ClusterHelio;
}> = ({ children, cluster }) => {
  const network =
    cluster === ClusterHelio.Devnet
      ? WalletAdapterNetwork.Devnet
      : WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => getClusterEndpoint(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AnchorProvider>
            <HelioProvider>
              <AddressProvider>
                <CheckoutSearchParamsProvider>
                  {children}
                </CheckoutSearchParamsProvider>
              </AddressProvider>
            </HelioProvider>
          </AnchorProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
