import { SplitWallet } from '@heliofi/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react/src/useAnchorWallet';

import {
  PaymentResponse,
  BasePaymentResponse,
  SwapPaymentResponse,
  isSwapResponse,
} from './models/PaymentResponse';
import { BasePaymentProps } from './models/PaymentProps';
import { HelioApiConnector, HttpCodes } from '../../../domain';
import { BaseTransactionPayload } from './models/TransactionPayload';
import { getTransactionSignature } from '../getTransactionSignature';
import type { CurrencyService, ConfigService } from '../../../domain';
import { ExecuteTransactionPayload, SignedTxAndToken } from '../types';
import { VerificationError } from '../../solana-adapter/VerificationError';
import { TransactionTimeoutError } from '../../solana-adapter/TransactionTimeoutError';

export abstract class BasePaymentService<
  TransactionParams,
  Payload extends BaseTransactionPayload,
  Props extends BasePaymentProps<Res>,
  Res extends BasePaymentResponse
> {
  protected abstract readonly endpoint: string;

  protected mintAddress?: PublicKey;

  protected wallet?: AnchorWallet;

  protected connection?: Connection;

  constructor(
    protected apiService: HelioApiConnector,
    private currencyService: CurrencyService,
    private configService: ConfigService
  ) {}

  protected abstract executeTransaction(
    requestOrPaymentId: string,
    {
      request,
      symbol,
      quantity,
      splitWallets,
      canSwapTokens,
      swapRouteToken,
      fixedCurrencyRateToken,
    }: ExecuteTransactionPayload<TransactionParams>
  ): Promise<SignedTxAndToken>;

  protected abstract getTransactionParams(props: Props): TransactionParams;

  protected abstract getTransactionPayload(
    props: Props,
    signedTx: string,
    token: string | undefined,
    swapSignedTx?: string
  ): Payload;

  protected async init({ symbol, wallet, connection }: Props) {
    this.wallet = wallet;
    this.connection = connection;

    const currency = this.currencyService.getCurrencyBySymbol(symbol);

    if (!currency) {
      throw new Error(`Unable to find currency: ${currency}`);
    }

    this.mintAddress = new PublicKey(currency.mintAddress as string);
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
    const canSwapTokens = properties.canSwapTokens as boolean;
    const swapRouteToken = properties.swapRouteToken as string;
    const sendTransactionResponse = await this.sendTransaction(
      String(requestOrPaymentId),
      {
        request: this.getTransactionParams(props),
        symbol: props.symbol,
        quantity,
        splitWallets,
        canSwapTokens,
        swapRouteToken,
        fixedCurrencyRateToken: props?.rateToken,
      }
    );

    if (sendTransactionResponse?.signedTx === undefined) {
      props.onError({ errorMessage: 'Failed to send transaction' });
      return;
    }

    const { token, signedTx, swapSignedTx } = sendTransactionResponse;
    if (!this.isSignedTransactionValid(signedTx)) {
      props.onError({ errorMessage: 'Transaction canceled' });
      return;
    }

    const payload = this.getTransactionPayload(
      props,
      signedTx,
      token,
      swapSignedTx
    );

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

  protected async sendTransaction(
    requestOrPaymentId: string,
    {
      request,
      symbol,
      quantity,
      splitWallets,
      canSwapTokens,
      swapRouteToken,
      fixedCurrencyRateToken,
    }: ExecuteTransactionPayload<TransactionParams>
  ): Promise<SignedTxAndToken | undefined> {
    try {
      return await this.executeTransaction(requestOrPaymentId, {
        request,
        symbol,
        quantity,
        splitWallets,
        canSwapTokens,
        swapRouteToken,
        fixedCurrencyRateToken,
      });
    } catch (e) {
      return { error: new TransactionTimeoutError(String(e)) };
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

  protected async approveSwapTransaction(
    reqBody: Payload
  ): Promise<SwapPaymentResponse> {
    const HELIO_BASE_API_URL = this.configService.getHelioApiBaseUrl();
    const res = await fetch(`${HELIO_BASE_API_URL}/${this.endpoint}/swap`, {
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

  protected async approveTransactionByType(
    payload: Payload,
    onSuccess: BasePaymentProps<Res>['onSuccess']
  ) {
    if (payload.signedSwapTransaction != null) {
      const response = await this.approveSwapTransaction(payload);
      this.onSuccess(response, payload, onSuccess);
    } else {
      const response = await this.approveTransaction(payload);
      this.onSuccess(response, payload, onSuccess);
    }
  }

  protected async handleApprovedTransaction(
    payload: Payload,
    onSuccess: BasePaymentProps<Res>['onSuccess'],
    onError: BasePaymentProps<Res>['onError'],
    onPending: BasePaymentProps<Res>['onPending']
  ): Promise<void> {
    try {
      await this.approveTransactionByType(payload, onSuccess);
    } catch (e) {
      const errorHandler = (message: string) => {
        onError({
          errorMessage: message,
          transaction: getTransactionSignature(payload.signedTransaction),
        });
      };
      onPending?.({ transaction: payload.signedTransaction });
      await this.executeCommand(async () => {
        await this.approveTransactionByType(payload, onSuccess);
      }, errorHandler);
    }
  }

  protected onSuccess(
    response: PaymentResponse,
    payload: Payload,
    onSuccess: BasePaymentProps<Res>['onSuccess']
  ): void {
    onSuccess({
      transaction: response.transactionSignature,
      data: response as Res,
      swapTransactionSignature: isSwapResponse(response)
        ? response.swapTransactionSignature
        : undefined,
    });
  }

  protected isSignedTransactionValid(signedTransaction?: string): boolean {
    return !(signedTransaction == null || signedTransaction.length === 0);
  }
}
