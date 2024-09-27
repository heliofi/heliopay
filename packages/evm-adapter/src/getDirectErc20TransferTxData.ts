import { JsonRpcSigner, TransactionResponse } from '@ethersproject/providers';
import { BigNumber, Contract, utils } from 'ethers';
import { erc20 } from './abi';

export const getDirectErc20TransferTxData = async (
  recipient: string,
  amount: bigint
): Promise<string> => {
  const erc20Interface = new utils.Interface(erc20.abi);
  const amountBN = BigNumber.from(amount);
  return erc20Interface.encodeFunctionData('transfer', [recipient, amountBN]);
};
