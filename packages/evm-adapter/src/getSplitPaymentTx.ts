import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { PaymentRequest, RecipientAndAmount } from './types';

export const getSplitPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest,
  recipientsAndAmounts: RecipientAndAmount[],
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);
  const unsignedTx = await contract.populateTransaction.splitPayment(
    req.recipientAddress,
    req.tokenAddres,
    BigNumber.from(req.amount),
    BigNumber.from(req.fee),
    recipientsAndAmounts,
    req.transactonDbId,
    {
      gasLimit,
      gasPrice: await provider.getGasPrice(),
      nonce: await provider.getTransactionCount(req.walletAddress),
    }
  );
  unsignedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return unsignedTx;
};
