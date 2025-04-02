import { Contract, JsonRpcSigner, TransactionResponse } from 'ethers';
import { erc20 } from './abi';
import { getContractAddress } from './utils';

export const requestTokenAmountApproval = async (
  signer: JsonRpcSigner,
  amount: bigint,
  chainId: number,
  tokenAddress: string | undefined
): Promise<TransactionResponse> => {
  if (!tokenAddress || !chainId) {
    throw new Error('Missing erc20 token address or chainId');
  }
  const contractAddress = getContractAddress(chainId);
  if (!contractAddress) {
    throw new Error(`Non existant contract address for chainId ${chainId}`);
  }
  const erc20Contract = new Contract(tokenAddress, erc20.abi, signer);
  return await erc20Contract.approve(contractAddress, amount, {
    from: await signer.getAddress(),
  });
};
