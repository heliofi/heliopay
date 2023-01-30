import { Program } from '@project-serum/anchor';
import { createContext, useContext } from 'react';
import { HelioIdl } from '@heliofi/solana-adapter';

// The network and wallet context used to send transactions paid for and signed by the provider.
// In this context we deliver to the consumers the Helio's programs on the Solana's network
// documentation: https://project-serum.github.io/anchor/ts/classes/Provider.html
export const AnchorContext = createContext<Program<HelioIdl> | null>(null);

export const useAnchorProvider = () => useContext(AnchorContext);
