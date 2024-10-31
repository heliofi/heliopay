import { Interface } from 'ethers/lib/utils';
import { erc20 } from './abi';

export const getErc20ContractInterface = (): Interface => {
  return new Interface(erc20.abi);
};
