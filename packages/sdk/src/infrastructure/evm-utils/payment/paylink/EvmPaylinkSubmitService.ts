import { Web3Provider } from '@ethersproject/providers';
import { CustomerDetails, ProductDetails, SplitWallet } from '@heliofi/common';
import { isEmpty } from 'lodash';
import { Address } from 'wagmi';

import { BigNumber } from '../../../../domain/model/BigNumber';

import { BaseEvmPaymentService } from '../BaseEvmPaymentService';
import { BasePaymentProps } from '../models/PaymentProps';
import { BaseTransactionPayload } from '../models/TransactionPayload';
import { sendEvmTransaction } from '../../SendEvmTransaction';
import { ExecuteTransactionPayload, SignedTxAndToken } from '../../types';
import { checkNetwork } from '../../utils';
import { fromBigintToStringForSerialization } from '../../../../utils';
import { BasePaymentResponse } from '../models/PaymentResponse';
import { LoadingModalStep } from '../../../../domain';

export interface CreatePaymentProps
  extends BasePaymentProps<ApproveTransactionResponse> {
  recipientPK: string;
  amount: BigNumber;
  paymentRequestId: string;
  quantity?: number;
  splitRevenue?: boolean;
  splitWallets?: SplitWallet[];
  discountToken?: string;
  canSwapTokens?: boolean;
  swapRouteToken?: string;
  rateToken?: string;
}

interface GetAndSignPayload {
  provider: Web3Provider;
  request: PaylinkRequest;
  symbol?: string;
  paymentRequestId: string;
  quantity?: number;
  fixedCurrencyRateToken?: string;
  productDetails?: ProductDetails;
  customerDetails?: CustomerDetails;
  mintAddress: string;
  setLoadingModalStep?: (step: LoadingModalStep) => void;
}

export type ApproveTransactionResponse = BasePaymentResponse;

export interface ApproveTransactionPayload extends BaseTransactionPayload {
  paymentRequestId: string;
  amount: string;
  sender: string;
  recipient: string;
  currency: string;
  customerDetails?: CustomerDetails;
  quantity?: number;
  productDetails?: ProductDetails;
  splitRevenue?: boolean;
  splitWallets?: SplitWallet[];
  rateToken?: string;
  signedSwapTransaction?: string;
  discountToken?: string;
}

// TODO ask Ivan to add into adapter
export type EVMSinglePaymentRequest = {
  amount: string;
  sender: Address | string;
  recipient: Address | string;
  mintAddress: string;
  discountToken?: string;
};

type PaylinkRequest = EVMSinglePaymentRequest & {
  splitRevenue?: boolean;
  splitWallets?: SplitWallet[];
  discountToken?: string;
};

export abstract class EvmPaylinkSubmitService extends BaseEvmPaymentService<
  EVMSinglePaymentRequest,
  ApproveTransactionPayload,
  CreatePaymentProps,
  ApproveTransactionResponse
> {
  protected abstract readonly prepareEndpoint: string;

  protected async init(props: CreatePaymentProps): Promise<void> {
    await super.init(props);
  }

  protected async executeTransaction(
    paymentRequestId: string,
    provider: Web3Provider,
    {
      request,
      symbol,
      quantity,
      splitWallets,
      canSwapTokens,
      swapRouteToken,
      fixedCurrencyRateToken,
      customerDetails,
      productDetails,
      setLoadingModalStep,
      mintAddress,
    }: ExecuteTransactionPayload<EVMSinglePaymentRequest>
  ): Promise<SignedTxAndToken> {
    if (provider && request) {
      const { chainId } = await provider.getNetwork();
      checkNetwork(chainId, this.cluster, this.blockchain);
      return this.getAndSignSinglePaymentTx({
        provider,
        request,
        symbol,
        paymentRequestId,
        quantity,
        fixedCurrencyRateToken,
        customerDetails,
        productDetails,
        mintAddress,
        setLoadingModalStep,
      });
    }
    throw new Error('Connection or wallet is not defined');
  }

  protected async getTransactionParams({
    amount,
    anchorProvider,
    recipientPK,
    splitRevenue,
    splitWallets,
    discountToken,
  }: CreatePaymentProps): Promise<EVMSinglePaymentRequest> {
    const address = await anchorProvider.getSigner().getAddress();
    if (!address) {
      throw new Error('Public key is invalid');
    }

    return {
      amount: String(amount),
      sender: address,
      recipient: recipientPK,
      mintAddress: this.mintAddress as string,
      discountToken,
    };
  }

  protected async getTransactionPayload(
    {
      amount,
      paymentRequestId,
      anchorProvider,
      recipientPK,
      symbol,
      customerDetails,
      productDetails,
      quantity,
      splitRevenue,
      splitWallets,
      rateToken,
      discountToken,
    }: CreatePaymentProps,
    signedTx: string,
    token: string,
    swapSignedTx?: string
  ): Promise<ApproveTransactionPayload> {
    const details = isEmpty(productDetails) ? {} : { productDetails };
    const sender = await anchorProvider.getSigner().getAddress();
    return {
      signedTransaction: signedTx,
      signedSwapTransaction: swapSignedTx,
      transactionToken: token,
      paymentRequestId,
      amount: fromBigintToStringForSerialization(amount),
      sender,
      recipient: recipientPK,
      splitRevenue,
      discountToken,
      splitWallets,
      currency: symbol,
      cluster: this.cluster,
      customerDetails,
      quantity: quantity || 1,
      rateToken,
      ...details,
    };
  }

  protected async getAndSignSinglePaymentTx({
    provider,
    request,
    symbol,
    paymentRequestId,
    quantity,
    fixedCurrencyRateToken,
    customerDetails,
    productDetails,
    setLoadingModalStep,
  }: GetAndSignPayload): Promise<SignedTxAndToken> {
    const prepareTransactionResponse =
      await this.apiService.getPreparedTransactionMessage(
        this.prepareEndpoint,
        JSON.stringify({
          paymentRequestId,
          currency: symbol,
          quantity,
          fixedCurrencyRateToken,
          customerDetails,
          productDetails: !isEmpty(productDetails) ? productDetails : undefined,
          ...request,
        })
      );

    const transactionResponse = await sendEvmTransaction({
      prepareTransactionResponse,
      tokenAddress: this.mintAddress,
      isNativeTokenAddress: this.isNativeMintAddress,
      provider,
      setLoadingModalStep,
    });

    setLoadingModalStep?.(LoadingModalStep.SUBMIT_TRANSACTION);

    return {
      signedTx: JSON.stringify(transactionResponse),
      token: prepareTransactionResponse.transactionToken,
    };
  }
}
