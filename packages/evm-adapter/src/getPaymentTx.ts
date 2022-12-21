import { Wallet, BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';

export const getPaymentTx = async (
  wallet: Wallet,
  recipientAddress: string,
  tokenAddres: string,
  amount: bigint,
  fee: number,
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, wallet);
  const serializedTx = await contract
    .connect(wallet)
    .populateTransaction.payment(
      recipientAddress,
      tokenAddres,
      BigNumber.from(amount),
      BigNumber.from(fee),
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
