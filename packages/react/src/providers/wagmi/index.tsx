import { FC, PropsWithChildren } from 'react';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

export const { provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
  [publicProvider()]
);

const client = createClient({ autoConnect: true, provider });

export const EVMProvider: FC<{ children: PropsWithChildren<any> }> = ({
  children,
}) => <WagmiConfig client={client}>{children}</WagmiConfig>;
