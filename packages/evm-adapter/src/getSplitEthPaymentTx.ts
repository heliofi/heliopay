import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { RecipientAndAmount } from './types';

export const getSplitEthPaymentTx = async (
  provider: BaseProvider,
  walletAddress: string,
  recipientAddress: string,
  amount: bigint,
  fee: number,
  recipientsAndAmounts: RecipientAndAmount[],
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);
  let totalAmount = BigNumber.from(amount);
  // eslint-disable-next-line no-restricted-syntax
  for (const r of recipientsAndAmounts) {
    totalAmount = totalAmount.add(r.amount);
  }
  const serializedTx = await contract.populateTransaction.splitEthPayment(
    recipientAddress,
    BigNumber.from(amount),
    BigNumber.from(fee),
    recipientsAndAmounts,
    {
      from: walletAddress,
      value: totalAmount,
      gasPrice: await provider.getGasPrice(),
      gasLimit,
      nonce: await provider.getTransactionCount(walletAddress),
    }
  );
  serializedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return serializedTx;
};
