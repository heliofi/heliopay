import { JsonRpcProvider, TransactionRequest } from 'ethers';
import { directTransferGasLimit } from './constants';

export const getDirectTransferTx = async (
  provider: JsonRpcProvider,
  recipient: string,
  amount: bigint
): Promise<TransactionRequest> => {
  const { chainId } = await provider.getNetwork();
  const { gasPrice } = await provider.getFeeData();
  return {
    to: recipient,
    value: amount,
    chainId,
    gasPrice,
    gasLimit: directTransferGasLimit,
  };
};
