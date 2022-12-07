import { SplitWallet } from '@heliofi/common';
import { AnchorWallet } from '@solana/wallet-adapter-react/src/useAnchorWallet';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import { HttpCodes } from '../../../domain';
import { CurrencyService } from '../../../domain/services/CurrencyService';
import { getHelioApiBaseUrl } from '../../helio-api/HelioApiAdapter';
import { TransactionTimeoutError } from '../../solana-adapter/TransactionTimeoutError';
import { VerificationError } from '../../solana-adapter/VerificationError';
import { TransactionSignatureAndToken } from '../types';
import { BasePaymentProps } from './models/PaymentProps';
import { BasePaymentResponse } from './models/PaymentResponse';
import { BaseTransactionPayload } from './models/TransactionPayload';

export abstract class BasePaymentService<
  TransactionParams,
  Payload extends BaseTransactionPayload,
  Props extends BasePaymentProps<Res>,
  Res extends BasePaymentResponse
> {
  protected abstract readonly endpoint: string;

  protected mintAddress?: PublicKey;

  protected cluster?: Cluster;

  protected wallet?: AnchorWallet;

  protected connection?: Connection;

  protected abstract executeTransaction({
    requestOrPaymentId,
    request,
    symbol,
    quantity,
    splitWallets,
    rateToken,
    cluster,
  }: {
    requestOrPaymentId: string;
    request?: TransactionParams;
    symbol?: string;
    quantity?: number;
    splitWallets?: SplitWallet[];
    rateToken?: string;
    cluster: Cluster;
  }): Promise<TransactionSignatureAndToken>;

  protected abstract getTransactionParams(props: Props): TransactionParams;

  protected abstract getTransactionPayload(
    props: Props,
    signature: string,
    token: string | undefined
  ): Payload;

  protected async init({ symbol, wallet, connection, cluster }: Props) {
    this.wallet = wallet;
    this.connection = connection;

    this.mintAddress = new PublicKey(
      CurrencyService.getCurrencyBySymbol(symbol).mintAddress as string
    );
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
    const sendTransactionResponse = await this.sendTransaction({
      requestOrPaymentId: String(requestOrPaymentId),
      request: this.getTransactionParams(props),
      symbol: props.symbol,
      quantity: quantity,
      rateToken: props?.rateToken,
      cluster: props.cluster,
    });
    if (sendTransactionResponse?.signature === undefined) {
      props.onError({ errorMessage: 'Failed to send transaction' });
      return;
    }

    const { token, signature } = sendTransactionResponse;

    const payload = this.getTransactionPayload(props, signature, token);
    await this.handleApprovedTransaction(
      payload,
      props.onSuccess,
      props.onError,
      props.onPending
    );
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

  protected async sendTransaction({
    requestOrPaymentId,
    request,
    symbol,
    quantity,
    rateToken,
    cluster,
  }: {
    requestOrPaymentId: string;
    request?: TransactionParams;
    symbol?: string;
    quantity?: number;
    rateToken?: string;
    cluster: Cluster;
  }): Promise<TransactionSignatureAndToken | undefined> {
    try {
      return await this.executeTransaction({
        requestOrPaymentId,
        request,
        symbol,
        quantity,
        rateToken,
        cluster,
      });
    } catch (e) {
      return { error: new TransactionTimeoutError(String(e)) };
    }
  }

  protected async approveTransaction(
    reqBody: Payload
  ): Promise<BasePaymentResponse> {
    const HELIO_BASE_API_URL = getHelioApiBaseUrl(reqBody.cluster);
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

  protected async handleApprovedTransaction(
    payload: Payload,
    onSuccess: BasePaymentProps<Res>['onSuccess'],
    onError: BasePaymentProps<Res>['onError'],
    onPending: BasePaymentProps<Res>['onPending']
  ): Promise<void> {
    try {
      const response = await this.approveTransaction(payload);
      this.onSuccess(response, payload, onSuccess);
    } catch (e) {
      const errorHandler = (message: string) => {
        onError({
          errorMessage: message,
          transaction: payload.signedTransaction,
        });
      };
      onPending({ transaction: payload.signedTransaction });
      await this.executeCommand(async () => {
        const response = await this.approveTransaction(payload);
        this.onSuccess(response, payload, onSuccess);
      }, errorHandler);
    }
  }

  protected onSuccess(
    response: BasePaymentResponse,
    payload: Payload,
    onSuccess: BasePaymentProps<Res>['onSuccess']
  ) {
    onSuccess({
      transaction: response.transactionSignature,
      data: response as Res,
    });
  }
}
