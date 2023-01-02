import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { PaymentRequest } from './types';

export const getEthPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest,
  fee: number,
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);
  const unsignedTx = await contract.populateTransaction.ethPayment(
    req.recipientAddress,
    BigNumber.from(req.amount),
    BigNumber.from(fee),
    {
      value: BigNumber.from(req.amount),
      gasLimit,
      gasPrice: await provider.getGasPrice(),
      nonce: await provider.getTransactionCount(req.walletAddress),
    }
  );
  unsignedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return unsignedTx;
};
