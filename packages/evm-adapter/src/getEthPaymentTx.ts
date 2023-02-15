import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { gasLimit } from './constants';
import { PaymentRequest } from './types';
import { getContractAddress } from './utils';

export const getEthPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest
) => {
  const chainId = (await provider.getNetwork()).chainId;
  const contractAddress = getContractAddress(chainId);
  if (!contractAddress) {
    throw new Error(`Non existant contract address for chainId ${chainId}`);
  }
  const contract = new Contract(contractAddress, helio.abi, provider);
  return await contract.populateTransaction.ethPayment(
    req.recipientAddress,
    BigNumber.from(req.amount),
    BigNumber.from(req.fee),
    req.transactonDbId,
    {
      value: BigNumber.from(req.amount),
      gasLimit,
      gasPrice: await provider.getGasPrice(),
      nonce: await provider.getTransactionCount(req.walletAddress),
    }
  );
};
