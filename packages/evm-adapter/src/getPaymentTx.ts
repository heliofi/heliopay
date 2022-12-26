import { BaseProvider } from '@ethersproject/providers';
import { Wallet, BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { contractAddress, gasLimit } from './constants';

export const getPaymentTx = async (
  provider: BaseProvider,
  walletAddress: string,
  recipientAddress: string,
  tokenAddres: string,
  amount: bigint,
  fee: number,
  chainId?: number
) => {
  const contract = new Contract(contractAddress, helio.abi, provider);
  const serializedTx = await contract.populateTransaction //.connect(wallet)
    .payment(
      recipientAddress,
      tokenAddres,
      BigNumber.from(amount),
      BigNumber.from(fee),
      {
        from: walletAddress,
        gasLimit,
        gasPrice: await provider.getGasPrice(),
        nonce: await provider.getTransactionCount(walletAddress),
      }
    );
  serializedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return serializedTx;
};
