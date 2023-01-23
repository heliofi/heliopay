import { JsonRpcSigner } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { erc20 } from './abi';
import { contractAddress } from './constants';

export const getPaymentTx = async (
  signer: JsonRpcSigner,
  amount: bigint,
  tokenAddress: string
) => {
  if (tokenAddress) {
    throw new Error('Missing erc20 token address');
  }
  const erc20Contract = new Contract(tokenAddress, erc20.abi, signer);
  await erc20Contract.connect(signer).approve(contractAddress, amount, {
    from: await signer.getAddress(),
  });
};
