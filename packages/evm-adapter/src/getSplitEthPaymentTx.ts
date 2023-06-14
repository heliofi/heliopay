import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { gasLimit } from './constants';
import { PaymentRequest, RecipientAndAmount } from './types';
import { getContractAddress } from './utils';

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
  const contract = new Contract(contractAddress, helio.abi, provider);

  const totalAmount =
    req.amount + recipientsAndAmounts.reduce((acc, r) => acc + r.amount, 0n);

  const BNRecipientsAndAmounts = recipientsAndAmounts.map((r) => ({
    recipient: r.recipient,
    amount: BigNumber.from(r.amount),
  }));

  const unsignedTx = await contract.populateTransaction.splitEthPayment(
    req.recipientAddress,
    BigNumber.from(req.amount),
    BigNumber.from(req.fee),
    BNRecipientsAndAmounts,
    req.transactonDbId,
    {
      value: totalAmount,
      gasPrice: await provider.getGasPrice(),
      gasLimit,
    }
  );
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
