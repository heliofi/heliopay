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
  let totalAmount = BigNumber.from(req.amount);
  // eslint-disable-next-line no-restricted-syntax
  for (const r of recipientsAndAmounts) {
    totalAmount = totalAmount.add(r.amount);
  }
  const unsignedTx = await contract.populateTransaction.splitEthPayment(
    req.recipientAddress,
    BigNumber.from(req.amount),
    BigNumber.from(req.fee),
    recipientsAndAmounts,
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
