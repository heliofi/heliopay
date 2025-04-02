import { Contract, JsonRpcSigner, TransactionResponse } from 'ethers';
import { erc20 } from './abi';

export const directErc20Transfer = async (
  signer: JsonRpcSigner,
  recipient: string,
  amount: bigint,
  tokenAddress: string
): Promise<TransactionResponse> => {
  const erc20Contract = new Contract(tokenAddress, erc20.abi, signer);
  return erc20Contract.transfer(recipient, amount);
};
