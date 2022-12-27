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
  const serializedTx = await contract.populateTransaction.payment(
    req.recipientAddress,
    req.tokenAddres,
    BigNumber.from(req.amount),
    BigNumber.from(fee),
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
