import {
  JsonRpcSigner,
  TransactionResponse,
  Web3Provider,
} from '@ethersproject/providers';
import { PrepareTransaction, TokenTransactionPayload } from '@heliofi/common';
import { requestTokenAmountApproval } from '@heliofi/evm-adapter';
import { utils } from 'ethers';
import jwtDecode from 'jwt-decode';
import { LoadingModalStep } from '../../domain/model/LoadingModalStep';

async function getSigner(provider: Web3Provider): Promise<JsonRpcSigner> {
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

export async function sendEvmTransaction({
  prepareTransactionResponse,
  provider,
  tokenAddress,
  isNativeTokenAddress,
  setLoadingModalStep,
}: {
  prepareTransactionResponse: PrepareTransaction;
  provider: Web3Provider;
  tokenAddress?: string;
  isNativeTokenAddress?: boolean;
  setLoadingModalStep?: (step: LoadingModalStep) => void;
}): Promise<TransactionResponse> {
  const signer = await getSigner(provider);
  const decodedToken: TokenTransactionPayload = jwtDecode(
    prepareTransactionResponse.transactionToken
  );
  const amountToApprove = decodedToken.finalAmount;

  if (amountToApprove && tokenAddress != null && !isNativeTokenAddress) {
    const { chainId } = await provider.getNetwork();

    await (
      await requestTokenAmountApproval(
        signer,
        BigInt(amountToApprove),
        chainId,
        tokenAddress
      )
    ).wait();
  }

  setLoadingModalStep?.(LoadingModalStep.SIGN_TRANSACTION);

  const { r, s, v, type, ...transaction } = utils.parseTransaction(
    prepareTransactionResponse.transactionMessage
  );

  return signer.sendTransaction(transaction);
}
