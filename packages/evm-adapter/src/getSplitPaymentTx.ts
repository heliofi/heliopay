import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { PaymentRequest, RecipientAndAmount } from './types';

export const getSplitPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest,
  fee: number,
  recipientsAndAmounts: RecipientAndAmount[],
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);
  const serializedTx = await contract.populateTransaction.splitPayment(
    req.recipientAddress,
    req.tokenAddres,
    BigNumber.from(req.amount),
    BigNumber.from(fee),
    recipientsAndAmounts,
    {
      from: req.walletAddress,
      gasLimit,
      gasPrice: await provider.getGasPrice(),
      nonce: await provider.getTransactionCount(req.walletAddress),
    }
  );
  serializedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return serializedTx;
};
