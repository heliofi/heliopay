import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { PaymentRequest, RecipientAndAmount } from './types';
import { getContractAddress } from './utils';

export const getPaymentTx = async (
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

  const valueOverride =
    Number(req.tokenAddres) === 0
      ? {
          value: recipientsAndAmounts.reduce((acc, r) => acc + r.amount, 0n),
        }
      : undefined;

  const unsignedTx = await contract.populateTransaction.payment(
    req.tokenAddres,
    BNRecipientsAndAmounts,
    req.transactonDbId,
    valueOverride
  );
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
