import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { RecipientAndAmount } from './types';

export const getSplitPaymentTx = async (
  provider: BaseProvider,
  walletAddress: string,
  recipientAddress: string,
  tokenAddres: string,
  amount: bigint,
  fee: number,
  recipientsAndAmounts: RecipientAndAmount[],
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);
  const serializedTx = await contract.populateTransaction.splitPayment(
    recipientAddress,
    tokenAddres,
    BigNumber.from(amount),
    BigNumber.from(fee),
    recipientsAndAmounts,
    {
      from: walletAddress,
      gasLimit,
      gasPrice: await provider.getGasPrice(),
      nonce: await provider.getTransactionCount(walletAddress),
    }
  );
  serializedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return serializedTx;
};
