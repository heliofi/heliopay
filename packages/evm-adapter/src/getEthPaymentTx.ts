import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';

export const getEthPaymentTx = async (
  provider: BaseProvider,
  walletAddress: string,
  recipientAddress: string,
  amount: bigint,
  fee: number,
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);
  const serializedTx = await contract.populateTransaction.ethPayment(
    recipientAddress,
    BigNumber.from(amount),
    BigNumber.from(fee),
    {
      from: walletAddress,
      value: BigNumber.from(amount),
      gasLimit,
      gasPrice: await provider.getGasPrice(),
      nonce: await provider.getTransactionCount(walletAddress),
    }
  );
  serializedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return serializedTx;
};
