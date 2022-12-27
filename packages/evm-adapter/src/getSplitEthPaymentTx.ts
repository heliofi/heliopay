import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { PaymentRequest, RecipientAndAmount } from './types';

export const getSplitEthPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest,
  fee: number,
  recipientsAndAmounts: RecipientAndAmount[],
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);
  let totalAmount = BigNumber.from(req.amount);
  // eslint-disable-next-line no-restricted-syntax
  for (const r of recipientsAndAmounts) {
    totalAmount = totalAmount.add(r.amount);
  }
  const serializedTx = await contract.populateTransaction.splitEthPayment(
    req.recipientAddress,
    BigNumber.from(req.amount),
    BigNumber.from(fee),
    recipientsAndAmounts,
    {
      from: req.walletAddress,
      value: totalAmount,
      gasPrice: await provider.getGasPrice(),
      gasLimit,
      nonce: await provider.getTransactionCount(req.walletAddress),
    }
  );
  serializedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return serializedTx;
};
