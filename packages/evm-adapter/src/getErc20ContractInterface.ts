import { utils } from 'ethers';
import { erc20 } from './abi';

export const getErc20ContractInterface = (
  recipient: string,
  amount: bigint
): utils.Interface => {
  return new utils.Interface(erc20.abi);
};
