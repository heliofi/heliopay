import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { gasLimit } from './constants';
import { PaymentRequest } from './types';
import {
  getAbi,
  getContractAddress,
  getFeesAndAddresses,
  isPolygon,
} from './utils';

export const getEthPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest
) => {
  const { chainId } = await provider.getNetwork();
  const contractAddress = getContractAddress(chainId);
  if (!contractAddress) {
    throw new Error(`Non existant contract address for chainId ${chainId}`);
  }
  const contract = new Contract(contractAddress, getAbi(chainId), provider);
  const feesAndAddresses = getFeesAndAddresses(req);
  const params: Array<any> = [
    req.recipientAddress,
    BigNumber.from(req.amount),
    BigNumber.from(req.fee),
    req.transactonDbId,
  ];
  if (isPolygon(chainId)) {
    params.push(feesAndAddresses);
  }
  const unsignedTx = await contract.populateTransaction.ethPayment(...params, {
    value: BigNumber.from(req.amount),
    gasLimit,
    gasPrice: await provider.getGasPrice(),
  });
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
