import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { PaymentRequest } from './types';

export const getPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest,
  fee: number,
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);

  const amount = BigNumber.from(req.amount);
  const unsignedTx = await contract.populateTransaction.payment(
    req.recipientAddress,
    req.tokenAddres,
    amount,
    BigNumber.from(fee),
    {
      gasLimit,
      gasPrice: await provider.getGasPrice(),
      nonce: await provider.getTransactionCount(req.walletAddress),
    }
  );
  unsignedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return unsignedTx;
};
