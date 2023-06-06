import {
  CustomerDetails,
  BasePaystreamTxWithTransaction,
} from '@heliofi/common';
import { CreatePaymentRequest } from '@heliofi/solana-adapter';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, VersionedTransaction } from '@solana/web3.js';

import {
  isEmptyObject,
  fromBigintToStringForSerialization,
} from '../../../../utils';
import { BasePaymentProps } from '../models/PaymentProps';
import { createTransaction } from '../../CreateTransaction';
import { BasePaystreamService } from './BasePaystreamService';
import { BigNumber } from '../../../../domain/model/BigNumber';
import { BasePaymentResponse, isSwapResponse } from '../models/PaymentResponse';
import { BaseTransactionPayload } from '../models/TransactionPayload';
import { ExecuteTransactionPayload, SignedTxAndToken } from '../../types';
import { signSwapTransactions, signTransaction } from '../../SignTransaction';

export interface CreatePaystreamProps
  extends BasePaymentProps<CreatePaystreamResponse> {
  interval: number;
  maxTime: number;
  recipientPK: string;
  amount: BigNumber;
  paymentRequestId: string;
  customerDetails?: CustomerDetails;
  quantity?: number;
  rateToken?: string;
  productDetails?: {
    name?: string;
    value?: string;
  };
  canSwapTokens?: boolean;
  swapRouteToken?: string;
  swapSignedTx?: string;
}

interface GetAndSignPayload {
  wallet: AnchorWallet;
  request: CreatePaymentRequest;
  symbol: string;
  paymentRequestId: string;
  fixedCurrencyRateToken?: string;
}

interface GetAndSignSwapPayload extends GetAndSignPayload {
  swapRoute: string;
}

export interface CreatePaystreamResponse extends BasePaymentResponse {
  document: {
    id: string;
    startedAt: bigint;
    endedAt: bigint;
  };
}

type CreatePaystreamAPIResponse = BasePaymentResponse &
  BasePaystreamTxWithTransaction;

interface ApproveStreamTransactionPayload extends BaseTransactionPayload {
  paymentAccount: string;
  startedAt: number;
  endedAt: number;
  interval: number;
  paymentRequestId: string;
  amount: string;
  sender: string;
  recipient: string;
  currency: string;
  customerDetails?: CustomerDetails;
  rateToken?: string;
  productDetails?: {
    name?: string;
    value?: string;
  };
}

export class PaystreamStartService extends BasePaystreamService<
  CreatePaymentRequest,
  ApproveStreamTransactionPayload,
  CreatePaystreamProps,
  CreatePaystreamResponse
> {
  protected readonly endpoint = 'stream-backend/create';

  protected readonly prepareEndpoint = '/prepare/stream/sol/create';

  private startedAt?: number;

  private endedAt?: number;

  private paymentAccount?: Keypair;

  private maxTime = 0;

  protected async init(props: CreatePaystreamProps) {
    await super.init(props);

    this.startedAt = this.dateToTimeStamp(new Date());
    this.maxTime = props.maxTime;
    this.endedAt = this.startedAt + this.maxTime;
    this.paymentAccount = new Keypair();
  }

  protected async executeTransaction(
    requestOrPaymentId: string,
    {
      request,
      symbol,
      fixedCurrencyRateToken,
      swapRouteToken,
      canSwapTokens,
    }: ExecuteTransactionPayload<CreatePaymentRequest>
  ): Promise<SignedTxAndToken> {
    if (this.connection && this.wallet) {
      if (swapRouteToken && canSwapTokens) {
        return this.getAndSignCreateSwapPaymentTx({
          wallet: this.wallet,
          request,
          symbol,
          paymentRequestId: requestOrPaymentId,
          swapRoute: swapRouteToken,
          fixedCurrencyRateToken,
        });
      }
      return this.getAndSignCreatePaymentTx({
        wallet: this.wallet,
        request,
        symbol,
        paymentRequestId: requestOrPaymentId,
        fixedCurrencyRateToken,
      });
    }
    throw new Error('Connection or wallet is not defined');
  }

  protected getTransactionParams({
    amount,
    anchorProvider,
    recipientPK,
    interval,
  }: CreatePaystreamProps): CreatePaymentRequest {
    return {
      amount: String(amount),
      sender: anchorProvider.provider.publicKey as PublicKey,
      recipient: new PublicKey(recipientPK),
      mintAddress: this.mintAddress,
      paymentAccount: this.paymentAccount?.publicKey as PublicKey,
      startAt: String(this.startedAt),
      endAt: String(this.endedAt),
      interval,
    };
  }

  protected getTransactionPayload(
    {
      paymentRequestId,
      amount,
      anchorProvider,
      recipientPK,
      symbol,
      customerDetails,
      productDetails,
      interval,
      rateToken,
    }: CreatePaystreamProps,
    signedTx: string,
    token: string,
    swapSignedTx?: string
  ): ApproveStreamTransactionPayload {
    const details = isEmptyObject(productDetails) ? {} : { productDetails };
    return {
      signedTransaction: signedTx,
      signedSwapTransaction: swapSignedTx,
      streamToken: token,
      paymentRequestId,
      amount: fromBigintToStringForSerialization(BigInt(amount)),
      sender: (anchorProvider.provider.publicKey as PublicKey).toBase58(),
      recipient: recipientPK,
      currency: symbol,
      customerDetails,
      paymentAccount: (this.paymentAccount as Keypair).publicKey.toBase58(),
      startedAt: this.startedAt as number,
      endedAt: this.endedAt as number,
      interval,
      rateToken,
      ...details,
    };
  }

  protected onSuccess(
    response: CreatePaystreamAPIResponse,
    payload: ApproveStreamTransactionPayload,
    onSuccess: CreatePaystreamProps['onSuccess']
  ) {
    onSuccess({
      transaction: payload.signedTransaction,
      data: {
        ...response,
        document: {
          ...response.document,
          startedAt: BigInt(response.document.startedAt.timestamp),
          endedAt: BigInt(response.document.endedAt),
        },
        content: response?.document?.content,
      },
      swapTransactionSignature: isSwapResponse(response)
        ? response.swapTransactionSignature
        : undefined,
    });
  }

  protected async getAndSignCreateSwapPaymentTx({
    wallet,
    request,
    symbol,
    paymentRequestId,
    swapRoute,
    fixedCurrencyRateToken,
  }: GetAndSignSwapPayload): Promise<SignedTxAndToken> {
    const prepareSwapTransactionResponse =
      await this.apiService.getPreparedTransactionSwapMessage(
        `${this.prepareEndpoint}/swap`,
        JSON.stringify({
          paymentRequestId,
          sender: request.sender.toBase58(),
          paymentAccount: request.paymentAccount.toBase58(),
          currency: symbol,
          startedAt: request.startAt,
          endedAt: request.endAt,
          interval: request.interval,
          swapRouteToken: swapRoute,
          fixedCurrencyRateToken,
        })
      );

    const swapTransaction = prepareSwapTransactionResponse?.swapTransaction;

    const standardTransaction = createTransaction(
      prepareSwapTransactionResponse?.standardTransaction
    );

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const swapTx = VersionedTransaction.deserialize(swapTransactionBuf) as any;

    const { swapSignedTx, standardSignedTx } = await signSwapTransactions(
      swapTx,
      standardTransaction,
      wallet,
      this.paymentAccount
    );

    const serializedSwapTx = Buffer.from(swapSignedTx.serialize()).toString(
      'base64'
    );

    return {
      swapSignedTx: serializedSwapTx,
      signedTx: standardSignedTx,
      token:
        prepareSwapTransactionResponse?.standardTransaction.transactionToken,
    };
  }

  protected async getAndSignCreatePaymentTx({
    wallet,
    request,
    symbol,
    paymentRequestId,
    fixedCurrencyRateToken,
  }: GetAndSignPayload): Promise<SignedTxAndToken> {
    const prepareTransactionResponse =
      await this.apiService.getPreparedTransactionMessage(
        this.prepareEndpoint,
        JSON.stringify({
          paymentRequestId,
          sender: request.sender.toBase58(),
          paymentAccount: request.paymentAccount.toBase58(),
          currency: symbol,
          startedAt: request.startAt,
          endedAt: request.endAt,
          interval: request.interval,
          fixedCurrencyRateToken,
        })
      );

    const transaction = createTransaction(prepareTransactionResponse);
    const signedTransaction = await signTransaction(
      transaction,
      wallet,
      this.paymentAccount
    );

    return {
      signedTx: signedTransaction,
      token: prepareTransactionResponse.transactionToken,
    };
  }
}
