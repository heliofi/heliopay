import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, PopulatedTransaction } from 'ethers';
import { directTransferGasLimit } from './constants';

export const getDirectTransferTx = async (
  provider: BaseProvider,
  recipient: string,
  amount: bigint
): Promise<PopulatedTransaction> => {
  const { chainId } = await provider.getNetwork();
  const gasPrice = await provider.getGasPrice();
  return {
    to: recipient,
    value: BigNumber.from(amount),
    chainId,
    gasPrice,
    gasLimit: BigNumber.from(directTransferGasLimit),
  };
};
