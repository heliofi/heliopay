import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { gasLimit } from './constants';
import { PaymentRequest } from './types';
import { getContractAddress, getFeesAndAddresses, isPolygon } from './utils';

export const getPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest
) => {
  const { chainId } = await provider.getNetwork();
  const contractAddress = getContractAddress(chainId);
  if (!contractAddress) {
    throw new Error(`Non existant contract address for chainId ${chainId}`);
  }

  const contract = new Contract(contractAddress, helio.abi, provider);

  const amount = BigNumber.from(req.amount);
  const feesAndAddresses = getFeesAndAddresses(req);
  const params: Array<any> = [
    req.recipientAddress,
    req.tokenAddres,
    amount,
    BigNumber.from(req.fee),
    req.transactonDbId,
  ];
  if (isPolygon(chainId)) {
    params.push(feesAndAddresses);
  }

  const unsignedTx = await contract.populateTransaction.payment(...params, {
    gasLimit,
    gasPrice: await provider.getGasPrice(),
  });
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
