import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, PopulatedTransaction } from 'ethers';

export const getDirectTransferTx = async (
  provider: BaseProvider,
  recipient: string,
  amount: bigint,
  tokenAddress?: string
): Promise<PopulatedTransaction> => {
  const { chainId } = await provider.getNetwork();
  const gasPrice = await provider.getGasPrice();
  return {
    to: recipient,
    value: BigNumber.from(amount),
    chainId,
    gasPrice,
    gasLimit: BigNumber.from(21000),
  };
};
