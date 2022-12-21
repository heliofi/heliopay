import { Wallet, BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';

export const getEthPaymentTx = async (
  wallet: Wallet,
  recipientAddress: string,
  amount: bigint,
  fee: number,
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, wallet);
  const serializedTx = await contract
    .connect(wallet)
    .populateTransaction.ethPayment(
      recipientAddress,
      BigNumber.from(amount),
      BigNumber.from(fee),
      {
        from: wallet.address,
        value: BigNumber.from(amount),
        gasLimit,
        gasPrice: await wallet.provider.getGasPrice(),
        nonce: await wallet.getTransactionCount(),
      }
    );
  serializedTx.chainId =
    chainId || (await wallet.provider.getNetwork()).chainId;
  return serializedTx;
};
