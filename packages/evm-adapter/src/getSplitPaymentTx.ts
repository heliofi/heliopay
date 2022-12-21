import { Wallet, BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';
import { RecipientAndAmount } from './types';

export const getSplitPaymentTx = async (
  wallet: Wallet,
  recipientAddress: string,
  tokenAddres: string,
  amount: bigint,
  fee: number,
  recipientsAndAmounts: RecipientAndAmount[],
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, wallet);
  const serializedTx = await contract
    .connect(wallet)
    .populateTransaction.splitPayment(
      recipientAddress,
      tokenAddres,
      BigNumber.from(amount),
      BigNumber.from(fee),
      recipientsAndAmounts,
      {
        from: wallet.address,
        gasLimit,
        gasPrice: await wallet.provider.getGasPrice(),
        nonce: await wallet.getTransactionCount(),
      }
    );
  serializedTx.chainId =
    chainId || (await wallet.provider.getNetwork()).chainId;
  return serializedTx;
};
