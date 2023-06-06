import { CustomerDetails, SplitWallet } from '@heliofi/common';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import 'reflect-metadata';
import { SinglePaymentRequest } from '@heliofi/solana-adapter';

import { BigNumber } from '../../../../domain/model/BigNumber';
import {
  fromBigintToStringForSerialization,
  isEmptyObject,
} from '../../../../utils';
import { createTransaction } from '../../CreateTransaction';
import { signTransaction } from '../../SignTransaction';

import { SignedTxAndToken } from '../../types';
import { BasePaymentService } from '../BasePaymentService';
import { BasePaymentProps } from '../models/PaymentProps';
import { PaymentResponse } from '../models/PaymentResponse';
import { BaseTransactionPayload } from '../models/TransactionPayload';

export interface CreatePaymentProps
  extends BasePaymentProps<ApproveTransactionResponse> {
  recipientPK: string;
  amount: BigNumber;
  paymentRequestId: string;
  customerDetails?: CustomerDetails;
  quantity?: number;
  productDetails?: {
    name?: string;
    value?: string;
  };
  splitRevenue?: boolean;
  splitWallets?: SplitWallet[];
  wallet: AnchorWallet;
  connection: Connection;
  canSwapTokens?: boolean;
  swapRouteToken?: string;
  rateToken?: string;
}

interface GetAndSignPayload {
  wallet: AnchorWallet;
  request: PaylinkRequest;
  symbol: string;
  paymentRequestId: string;
  quantity: number;
  fixedCurrencyRateToken?: string;
}

interface GetAndSignSwapPayload extends GetAndSignPayload {
  swapRoute: string;
}

export type ApproveTransactionResponse = PaymentResponse;

export interface ApproveTransactionPayload extends BaseTransactionPayload {
  paymentRequestId: string;
  amount: string;
  sender: string;
  recipient: string;
  currency: string;
  customerDetails?: CustomerDetails;
  quantity?: number;
  productDetails?: {
    name?: string;
    value?: string;
  };
  splitRevenue?: boolean;
  splitWallets?: SplitWallet[];
  rateToken?: string;
  signedSwapTransaction?: string;
}

type PaylinkRequest = SinglePaymentRequest & {
  splitRevenue?: boolean;
  splitWallets?: SplitWallet[];
};

export class PaylinkSubmitService extends BasePaymentService<
  SinglePaymentRequest,
  ApproveTransactionPayload,
  CreatePaymentProps,
  ApproveTransactionResponse
> {
  protected readonly endpoint = 'transaction/submit';

  protected readonly prepareEndpoint = '/prepare/transaction/sol/paylink';

  protected async init(props: CreatePaymentProps): Promise<void> {
    await super.init(props);
  }

  protected async executeTransaction(
    paymentRequestId: string,
    {
      request,
      symbol,
      quantity,
      canSwapTokens,
      swapRouteToken,
      fixedCurrencyRateToken,
    }: {
      request: PaylinkRequest;
      symbol: string;
      quantity: number;
      canSwapTokens?: boolean;
      swapRouteToken?: string;
      fixedCurrencyRateToken?: string;
    }
  ): Promise<SignedTxAndToken> {
    if (this.connection && this.wallet && request) {
      if (swapRouteToken && canSwapTokens) {
        return this.getAndSignSwapPaymentTx({
          wallet: this.wallet,
          request,
          symbol,
          paymentRequestId,
          quantity,
          swapRoute: swapRouteToken,
          fixedCurrencyRateToken,
        });
      }
      return this.getAndSignSinglePaymentTx({
        wallet: this.wallet,
        request,
        symbol,
        paymentRequestId,
        quantity,
        fixedCurrencyRateToken,
      });
    }
    throw new Error('Connection or wallet is not defined');
  }

  protected getTransactionParams({
    amount,
    anchorProvider,
    recipientPK,
    splitRevenue,
    splitWallets,
  }: CreatePaymentProps): SinglePaymentRequest & {
    splitRevenue?: boolean;
    splitWallets?: SplitWallet[];
  } {
    if (!anchorProvider.provider.publicKey) {
      throw new Error('Public key is invalid');
    }

    return {
      amount: String(amount),
      sender: anchorProvider.provider.publicKey,
      recipient: new PublicKey(recipientPK),
      mintAddress: this.mintAddress as PublicKey,
      splitRevenue,
      splitWallets,
    };
  }

  protected getTransactionPayload(
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
    }: CreatePaymentProps,
    signedTx: string,
    token: string,
    swapSignedTx?: string
  ): ApproveTransactionPayload {
    const details = isEmptyObject(productDetails) ? {} : { productDetails };
    return {
      signedTransaction: signedTx,
      signedSwapTransaction: swapSignedTx,
      transactionToken: token,
      paymentRequestId,
      amount: fromBigintToStringForSerialization(BigInt(amount)),
      sender: (anchorProvider.provider.publicKey as PublicKey).toBase58(),
      recipient: recipientPK,
      splitRevenue,
      splitWallets,
      currency: symbol,
      customerDetails,
      quantity: quantity || 1,
      rateToken,
      ...details,
    };
  }

  protected async getAndSignSwapPaymentTx({
    wallet,
    request,
    symbol,
    paymentRequestId,
    quantity,
    swapRoute,
    fixedCurrencyRateToken,
  }: GetAndSignSwapPayload): Promise<{
    swapSignedTx: string;
    signedTx: string;
    token: string;
  }> {
    const prepareSwapTransactionResponse =
      await this.apiService.getPreparedTransactionSwapMessage(
        `${this.prepareEndpoint}/swap`,
        JSON.stringify({
          paymentRequestId,
          currency: symbol,
          quantity,
          amount: request.amount,
          sender: request.sender,
          recipient: request.recipient,
          mintAddress: request.mintAddress,
          swapRouteToken: swapRoute,
          fixedCurrencyRateToken,
        })
      );

    const swapTransaction = prepareSwapTransactionResponse?.swapTransaction;
    const standardTx = createTransaction(
      prepareSwapTransactionResponse?.standardTransaction
    );

    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    const swapTx = VersionedTransaction.deserialize(swapTransactionBuf) as any;
    const [swapSignedTx, signedTx] = await wallet.signAllTransactions([
      swapTx,
      standardTx,
    ]);
    const serializedSwapTx = Buffer.from(swapSignedTx.serialize()).toString(
      'base64'
    );

    return {
      swapSignedTx: serializedSwapTx,
      signedTx: JSON.stringify(signedTx.serialize()),
      token:
        prepareSwapTransactionResponse?.standardTransaction.transactionToken,
    };
  }

  protected async getAndSignSinglePaymentTx({
    wallet,
    request,
    symbol,
    paymentRequestId,
    quantity,
    fixedCurrencyRateToken,
  }: GetAndSignPayload): Promise<SignedTxAndToken> {
    const prepareTransactionResponse =
      await this.apiService.getPreparedTransactionMessage(
        this.prepareEndpoint,
        JSON.stringify({
          paymentRequestId,
          currency: symbol,
          quantity,
          fixedCurrencyRateToken,
          ...request,
        })
      );

    const transaction = createTransaction(prepareTransactionResponse);
    const signedTransaction = await signTransaction(transaction, wallet);

    return {
      signedTx: signedTransaction,
      token: prepareTransactionResponse.transactionToken,
    };
  }
}
