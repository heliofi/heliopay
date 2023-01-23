import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio, erc20 } from './abi';
import { contractAddress, gasLimit } from './constants';
import { PaymentRequest } from './types';

export const getPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest,
  fee: number,
  chainId?: number
) => {
  if (!req.tokenAddres) {
    throw new Error('Missing erc20 token address');
  }
  const erc20Contract = new Contract(req.tokenAddres, erc20.abi, provider);
  const contract = new Contract(contractAddress, helio.abi, provider);

  const amount = BigNumber.from(req.amount);
  erc20Contract.approve(contractAddress, amount, {
    from: req.walletAddress,
  });

  const unsignedTx = await contract.populateTransaction.payment(
    req.recipientAddress,
    req.tokenAddres,
    amount,
    BigNumber.from(fee),
    {
      gasLimit,
      gasPrice: await provider.getGasPrice(),
      nonce: await provider.getTransactionCount(req.walletAddress),
    }
  );
  unsignedTx.chainId = chainId || (await provider.getNetwork()).chainId;
  return unsignedTx;
};
