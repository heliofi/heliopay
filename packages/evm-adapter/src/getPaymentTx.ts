import { Contract, ContractTransaction, JsonRpcProvider } from 'ethers';
import { helio } from './abi';
import { gasLimit } from './constants';
import { PaymentRequest, RecipientAndAmount } from './types';
import { getContractAddress } from './utils';

export const getPaymentTx = async (
  provider: JsonRpcProvider,
  req: PaymentRequest,
  recipientsAndAmounts: RecipientAndAmount[]
): Promise<ContractTransaction> => {
  const { chainId } = await provider.getNetwork();
  // @Todo: After ethers v6, chainId is a bigint, but in our system we use an enum with numbers
  const contractAddress = getContractAddress(Number(chainId));
  if (!contractAddress) {
    throw new Error(`Non existant contract address for chainId ${chainId}`);
  }

  const contract = new Contract(contractAddress, helio.abi, provider);

  const BNRecipientsAndAmounts = recipientsAndAmounts.map((r) => ({
    recipient: r.recipient,
    amount: r.amount,
  }));

  const overrides = {
    value:
      Number(req.tokenAddress) === 0
        ? recipientsAndAmounts.reduce((acc, r) => acc + r.amount, 0n)
        : 0n,
    gasLimit,
    gasPrice: (await provider.getFeeData()).gasPrice,
  };

  const unsignedTx = await contract.payment.populateTransaction(
    req.tokenAddress,
    BNRecipientsAndAmounts,
    req.transactonDbId,
    overrides
  );
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
