import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { gasLimit } from './constants';
import { PaymentRequest, RecipientAndAmount } from './types';
import { getContractAddress } from './utils';

export const getSplitPaymentTx = async (
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

  const BNRecipientsAndAmounts = recipientsAndAmounts.map((r) => ({
    recipient: r.recipient,
    amount: BigNumber.from(r.amount),
  }));

  const unsignedTx = await contract.populateTransaction.splitPayment(
    req.recipientAddress,
    req.tokenAddres,
    BigNumber.from(req.amount),
    BigNumber.from(req.fee),
    BNRecipientsAndAmounts,
    req.transactonDbId,
    {
      gasLimit,
      gasPrice: await provider.getGasPrice(),
    }
  );
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
