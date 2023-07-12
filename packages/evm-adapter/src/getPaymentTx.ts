import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { gasLimit } from './constants';
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

  const overrides = {
    value:
      Number(req.tokenAddress) === 0
        ? recipientsAndAmounts.reduce((acc, r) => acc + r.amount, 0n)
        : 0n,
    gasLimit,
    gasPrice: await provider.getGasPrice(),
  };

  const unsignedTx = await contract.populateTransaction.payment(
    req.tokenAddress,
    BNRecipientsAndAmounts,
    req.transactonDbId,
    overrides
  );
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
