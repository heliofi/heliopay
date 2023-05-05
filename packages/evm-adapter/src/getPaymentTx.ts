import { BaseProvider } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { helio } from './abi';
import { gasLimit } from './constants';
import { PaymentRequest } from './types';
import { getContractAddress } from './utils';

export const getPaymentTx = async (
  provider: BaseProvider,
  req: PaymentRequest
) => {
  const { chainId } = await provider.getNetwork();
  const contractAddress = getContractAddress(chainId);
  if (!contractAddress) {
    throw new Error(`Non existant contract address for chainId ${chainId}`);
  }

  const contract = new Contract(contractAddress, helio.abi, provider);

  const amount = BigNumber.from(req.amount);
  const unsignedTx = await contract.populateTransaction.payment(
    req.recipientAddress,
    req.tokenAddres,
    amount,
    BigNumber.from(req.fee),
    req.transactonDbId,
    {
      gasLimit,
      gasPrice: await provider.getGasPrice(),
    }
  );
  unsignedTx.chainId = chainId;
  return unsignedTx;
};
