import { AnchorWallet } from '@solana/wallet-adapter-react';

import { SignedTxAndToken } from '../../types';
import { signTransaction } from '../../SignTransaction';
import { BasePaymentProps } from '../models/PaymentProps';
import { createTransaction } from '../../CreateTransaction';
import { BasePaystreamService } from './BasePaystreamService';
import { BasePaymentResponse } from '../models/PaymentResponse';

interface CancelStreamProps extends BasePaymentProps<CancelStreamResponse> {
  paymentId: string;
}

type CancelPaymentRequest = Record<string, never>;

export interface CancelStreamResponse extends BasePaymentResponse {}

interface StreamCancelPayload {
  signedTransaction: string;
  canceledAt: number;
  streamToken?: string;
}

export class PaystreamCancelService extends BasePaystreamService<
  CancelPaymentRequest,
  StreamCancelPayload,
  CancelStreamProps,
  CancelStreamResponse
> {
  protected readonly endpoint = 'stream-backend/cancel';

  protected readonly prepareEndpoint = '/prepare/stream/sol/cancel';

  protected getTransactionParams(_: CancelStreamProps): CancelPaymentRequest {
    return {};
  }

  protected getTransactionPayload(
    _: CancelStreamProps,
    signedTx: string,
    token: string
  ): StreamCancelPayload {
    return {
      signedTransaction: signedTx,
      streamToken: token,
      canceledAt: this.dateToTimeStamp(new Date()),
    };
  }

  protected async executeTransaction(
    paymentTxId: string
  ): Promise<SignedTxAndToken> {
    if (this.connection && this.wallet) {
      return this.getAndSignCancelPaymentTx(this.wallet, paymentTxId);
    }
    throw new Error('Connection or wallet is not defined');
  }

  protected async getAndSignCancelPaymentTx(
    wallet: AnchorWallet,
    paymentTxId: string
  ): Promise<SignedTxAndToken> {
    const prepareTransactionResponse =
      await this.apiService.getPreparedTransactionMessage(
        this.prepareEndpoint,
        JSON.stringify({
          id: paymentTxId,
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
