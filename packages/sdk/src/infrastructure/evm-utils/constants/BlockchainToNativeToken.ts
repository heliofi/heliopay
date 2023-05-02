import { BlockchainSymbol } from '@heliofi/common';

import { EvmNativeTokens } from './EvmNativeTokens';

export const blockchainToNativeToken = new Map<
  BlockchainSymbol,
  EvmNativeTokens
>([
  [BlockchainSymbol.ETH, EvmNativeTokens.ETH],
  [BlockchainSymbol.POLYGON, EvmNativeTokens.MATIC],
]);
