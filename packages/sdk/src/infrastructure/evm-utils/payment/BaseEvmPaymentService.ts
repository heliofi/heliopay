import { Web3Provider } from '@ethersproject/providers';
import { Address } from 'wagmi';
import {
  BlockchainSymbol,
  SplitWallet,
  TransactionStatus,
} from '@heliofi/common';

import {
  HttpCodes,
  ConfigService,
  CurrencyService,
  HelioApiConnector,
  SECOND_MS,
  ClusterHelioType,
} from '../../../domain';

import {
  BasePaymentResponse,
  isSwapResponse,
  PaymentResponse,
} from './models/PaymentResponse';

import { BasePaymentProps } from './models/PaymentProps';
import { BaseTransactionPayload } from './models/TransactionPayload';
import { EvmTransactionTimeoutError } from '../EvmTransactionTimeoutError';
import { SignedTxAndToken, ExecuteTransactionPayload } from '../types';
import { delay } from '../../../utils';
import { VerificationError } from '../../solana-adapter/VerificationError';

export abstract class BaseEvmPaymentService<
  TransactionParams,
  Payload extends BaseTransactionPayload,
  Props extends BasePaymentProps<Res>,
  Res extends BasePaymentResponse
> {
  protected abstract readonly endpoint: string;

  protected abstract readonly statusEndpoint: string;

  protected mintAddress?: Address | string;

  protected cluster?: ClusterHelioType;

  protected isNativeMintAddress?: boolean;

  protected blockchain?: BlockchainSymbol;

  constructor(
    protected apiService: HelioApiConnector,
    private currencyService: CurrencyService,
    private configService: ConfigService
  ) {}

  protected abstract executeTransaction(
    requestOrPaymentId: string,
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
    }: ExecuteTransactionPayload<TransactionParams>
  ): Promise<SignedTxAndToken>;

  protected abstract getTransactionParams(
    props: Props
  ): Promise<TransactionParams>;

  protected abstract getTransactionPayload(
    props: Props,
    signedTx: string,
    token: string | undefined,
    swapSignedTx?: string
  ): Promise<Payload>;

  protected async init({
    mintAddress,
    blockchain,
    isNativeMintAddress,
    cluster,
  }: Props) {
    this.blockchain = blockchain;
    this.mintAddress = mintAddress;
    this.isNativeMintAddress = isNativeMintAddress;
    this.cluster = cluster;
  }

  public async handleTransaction(props: Props): Promise<void> {
    await this.init(props);
    const properties = props as Record<string, unknown>;
    const requestOrPaymentId =
      properties.paymentId ??
      properties.paymentStateId ??
      properties.paymentRequestId;
    const quantity = properties.quantity ? Number(properties.quantity) : 1;
    const splitWallets = properties.splitWallets as SplitWallet[];
    const canSwapTokens = Boolean(properties.canSwapTokens);
    const swapRouteToken = String(properties.swapRouteToken);
    const request = await this.getTransactionParams(props);
    const sendTransactionResponse = await this.sendTransaction(
      String(requestOrPaymentId),
      properties.anchorProvider as Web3Provider,
      {
        request,
        symbol: props.symbol,
        quantity,
        splitWallets,
        canSwapTokens,
        swapRouteToken,
        fixedCurrencyRateToken: props?.rateToken,
        customerDetails: props.customerDetails,
        productDetails: props.productDetails,
        setLoadingModalStep: props.setLoadingModalStep,
        mintAddress: props.mintAddress,
      }
    );

    if (!sendTransactionResponse?.signedTx) {
      props.onCancel?.();
      return;
    }

    const { token, signedTx, swapSignedTx } = sendTransactionResponse;
    if (!this.isSignedTransactionValid(signedTx)) {
      props.onError({ errorMessage: 'Transaction canceled' });
      return;
    }

    const payload = await this.getTransactionPayload(
      props,
      signedTx,
      token,
      swapSignedTx
    );

    await this.handleApprovedTransaction({
      payload,
      props,
    });
  }

  protected async executeCommand(
    callback: () => Promise<void>,
    onError: (message: string) => void
  ): Promise<void> {
    try {
      await callback();
    } catch (e) {
      onError('Unable to verify the transaction.');
    }
  }

  protected async sendTransaction(
    requestOrPaymentId: string,
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
      mintAddress,
      setLoadingModalStep,
    }: ExecuteTransactionPayload<TransactionParams>
  ): Promise<SignedTxAndToken | undefined> {
    try {
      return await this.executeTransaction(requestOrPaymentId, provider, {
        request,
        symbol,
        quantity,
        splitWallets,
        canSwapTokens,
        swapRouteToken,
        fixedCurrencyRateToken,
        customerDetails,
        productDetails,
        mintAddress,
        setLoadingModalStep,
      });
    } catch (e) {
      return { error: new EvmTransactionTimeoutError(String(e)) };
    }
  }

  protected async approveTransaction(
    reqBody: Payload
  ): Promise<BasePaymentResponse> {
    const HELIO_BASE_API_URL = this.configService.getHelioApiBaseUrl();
    const res = await fetch(`${HELIO_BASE_API_URL}/${this.endpoint}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });
    const result = await res.json();
    if (res.status === HttpCodes.CREATED) {
      return result;
    }
    if (res.status === HttpCodes.FAILED_DEPENDENCY) {
      throw new VerificationError(result.message);
    }
    throw new Error(result.message);
  }

  protected async handleApprovedTransaction({
    payload,
    props,
  }: {
    payload: Payload;
    props: Props;
  }): Promise<void> {
    try {
      const response = await this.approveTransaction(payload);
      await this.handleApproveResponse(response, props, payload);
    } catch (e) {
      props.onError?.({
        errorMessage: 'Failed to submit transaction',
      });
    }
  }

  async handleApproveResponse(
    approveResponse: BasePaymentResponse,
    props: Props,
    payload: Payload
  ): Promise<void> {
    switch (approveResponse.status) {
      case TransactionStatus.PENDING:
      case TransactionStatus.INITIATED:
        props.onPending?.({
          transaction: approveResponse.transactionSignature,
        });
        return this.checkStatus(props, payload, approveResponse.statusToken);
      case TransactionStatus.SUCCESS:
        return this.onSuccess(approveResponse, props.onSuccess, payload);
      default:
        return props.onError?.({
          errorMessage: 'Failed to submit transaction',
        });
    }
  }

  protected async checkStatus(
    props: Props,
    payload: Payload,
    statusToken?: string
  ): Promise<void> {
    if (statusToken == null) {
      props.onError({ errorMessage: 'Unable to check transaction status' });
      return;
    }
    const delaySec = SECOND_MS * 5;
    await delay(delaySec);
    const result = await this.apiService.getTransactionStatus(
      statusToken,
      this.statusEndpoint
    );
    return this.handleApproveResponse(result, props, payload);
  }

  protected onSuccess(
    response: PaymentResponse,
    onSuccess: BasePaymentProps<Res>['onSuccess'],
    payload: Payload
  ) {
    onSuccess({
      transaction: response.transactionSignature,
      data: response as Res,
      swapTransactionSignature: isSwapResponse(response)
        ? response?.swapTransactionSignature
        : undefined,
    });
  }

  protected isSignedTransactionValid(signedTransaction?: string): boolean {
    return !(signedTransaction == null || signedTransaction.length === 0);
  }
}
