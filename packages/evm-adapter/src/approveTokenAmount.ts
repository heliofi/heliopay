import { JsonRpcSigner, TransactionResponse } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { erc20 } from './abi';
import { contractAddress } from './constants';

export const approveTokenAmount = async (
  signer: JsonRpcSigner,
  amount: bigint,
  tokenAddress: string
): Promise<TransactionResponse> => {
  if (!tokenAddress) {
    throw new Error('Missing erc20 token address');
  }
  const erc20Contract = new Contract(tokenAddress, erc20.abi, signer);
  return await erc20Contract.connect(signer).approve(contractAddress, amount, {
    from: await signer.getAddress(),
  });
};
