import { ethers } from 'ethers';
import { erc20 } from './abi';

export const getDirectErc20TransferTxData = async (
  recipient: string,
  amount: bigint
): Promise<string> => {
  const erc20Interface = new ethers.Interface(erc20.abi);
  return erc20Interface.encodeFunctionData('transfer', [recipient, amount]);
};
