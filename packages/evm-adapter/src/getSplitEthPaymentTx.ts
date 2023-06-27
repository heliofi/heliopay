import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { gasLimit } from './constants';
import { PaymentRequest, RecipientAndAmount } from './types';
import {
  getAbi,
  getContractAddress,
  getFeesAndAddresses,
  isPolygon,
} from './utils';

export const getSplitEthPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest,
  recipientsAndAmounts: RecipientAndAmount[]
) => {
  const { chainId } = await provider.getNetwork();
  const contractAddress = getContractAddress(chainId);
  if (!contractAddress) {
    throw new Error(`Non existant contract address for chainId ${chainId}`);
  }
  const contract = new Contract(contractAddress, getAbi(chainId), provider);

  const totalAmount =
    req.amount + recipientsAndAmounts.reduce((acc, r) => acc + r.amount, 0n);

  const BNRecipientsAndAmounts = recipientsAndAmounts.map((r) => ({
    recipient: r.recipient,
    amount: BigNumber.from(r.amount),
  }));

  const feesAndAddresses = getFeesAndAddresses(req);
  const params: Array<any> = [
    req.recipientAddress,
    BigNumber.from(req.amount),
    BigNumber.from(req.fee),
    BNRecipientsAndAmounts,
    req.transactonDbId,
  ];
  if (isPolygon(chainId)) {
    params.push(feesAndAddresses);
  }

  const unsignedTx = await contract.populateTransaction.splitEthPayment(
    ...params,
    {
      value: totalAmount,
      gasPrice: await provider.getGasPrice(),
      gasLimit,
    }
  );
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
