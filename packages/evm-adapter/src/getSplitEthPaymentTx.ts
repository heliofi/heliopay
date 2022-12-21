import { Wallet, BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { RecipientAndAmount } from './types';

export const getSplitEthPaymentTx = async (
  wallet: Wallet,
  recipientAddress: string,
  amount: bigint,
  fee: number,
  recipientsAndAmounts: RecipientAndAmount[],
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, wallet);
  let totalAmount = BigNumber.from(amount);
  // eslint-disable-next-line no-restricted-syntax
  for (const r of recipientsAndAmounts) {
    totalAmount = totalAmount.add(r.amount);
  }
  const serializedTx = await contract
    .connect(wallet)
    .populateTransaction.splitEthPayment(
      recipientAddress,
      BigNumber.from(amount),
      BigNumber.from(fee),
      recipientsAndAmounts,
      {
        from: wallet.address,
        value: totalAmount,
        gasPrice: await wallet.provider.getGasPrice(),
        gasLimit,
        nonce: await wallet.getTransactionCount(),
      }
    );
  serializedTx.chainId =
    chainId || (await wallet.provider.getNetwork()).chainId;
  return serializedTx;
};
