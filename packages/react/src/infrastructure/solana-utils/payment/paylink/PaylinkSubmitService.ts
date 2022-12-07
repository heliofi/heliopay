import { PrepareTransaction, SplitWallet } from '@heliofi/common';
import { SinglePaymentRequest } from '@heliofi/solana-adapter';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';
import 'reflect-metadata';
import { CustomerDetails } from '../../../../domain';
import { BigNumber } from '../../../../domain/model/BigNumber';
import { fromBigintToStringForSerialization, isEmpty } from '../../../../utils';
import { HelioApiAdapter } from '../../../helio-api/HelioApiAdapter';
import { createTransaction } from '../../CreateTransaction';
import { signTransaction } from '../../SignTransaction';

import { TransactionSignatureAndToken } from '../../types';
import { BasePaymentService } from '../BasePaymentService';
import { BasePaymentProps } from '../models/PaymentProps';
import { BasePaymentResponse } from '../models/PaymentResponse';
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
  rateToken?: string;
}

export interface ApproveTransactionResponse extends BasePaymentResponse {
  content: {
    text: string;
  };
}

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
  // paymentRequestId: string,
  // request: PaylinkRequest,
  // symbol: string,
  // quantity: number,
  // splitWallets?: SplitWallet[],
  // rateToken?: string

  protected async executeTransaction({
    requestOrPaymentId,
    request,
    symbol,
    quantity,
    rateToken,
    cluster,
  }: {
    requestOrPaymentId: string;
    request: PaylinkRequest;
    symbol: string;
    quantity: number;
    splitWallets?: SplitWallet[];
    rateToken?: string;
    cluster: Cluster;
  }): Promise<TransactionSignatureAndToken> {
    if (this.connection && this.wallet) {
      return this.getAndSignSinglePaymentTx({
        wallet: this.wallet,
        request,
        symbol,
        paymentRequestId: requestOrPaymentId,
        quantity,
        rateToken,
        cluster,
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
    cluster,
  }: CreatePaymentProps): SinglePaymentRequest & {
    splitRevenue?: boolean;
    splitWallets?: SplitWallet[];
  } {
    if (!anchorProvider.provider.publicKey) {
      throw new Error('Public key is invalid');
    }

    return {
      amount: amount,
      sender: anchorProvider.provider.publicKey,
      recipient: new PublicKey(recipientPK),
      mintAddress: this.mintAddress as PublicKey,
      splitRevenue,
      splitWallets,
      cluster: cluster,
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
      cluster,
    }: CreatePaymentProps,
    signature: string,
    token: string
  ): ApproveTransactionPayload {
    const details = isEmpty(productDetails) ? {} : { productDetails };
    return {
      signedTransaction: signature,
      transactionToken: token,
      paymentRequestId: paymentRequestId,
      amount: fromBigintToStringForSerialization(BigInt(amount)),
      sender: (anchorProvider.provider.publicKey as PublicKey).toBase58(),
      recipient: recipientPK,
      splitRevenue,
      splitWallets,
      currency: symbol,
      cluster: cluster,
      customerDetails,
      quantity: quantity || 1,
      rateToken: rateToken,
      ...details,
    };
  }

  protected async getAndSignSinglePaymentTx({
    wallet,
    request,
    symbol,
    paymentRequestId,
    quantity,
    rateToken,
    cluster,
  }: {
    wallet: AnchorWallet;
    request: PaylinkRequest;
    symbol: string;
    paymentRequestId: string;
    quantity: number;
    rateToken?: string;
    cluster: Cluster;
  }): Promise<TransactionSignatureAndToken> {
    const prepareTransactionResponse =
      await HelioApiAdapter.publicRequest<PrepareTransaction>({
        endpoint: this.prepareEndpoint,
        cluster: cluster,
        options: {
          method: 'POST',
          body: JSON.stringify({
            paymentRequestId,
            currency: symbol,
            quantity: quantity,
            fixedCurrencyRateToken: rateToken,
            ...request,
          }),
        },
      });
    // const prepareTransactionResponse =
    //   await HelioApiAdapter.getPreparedTransactionMessage(
    //     this.prepareEndpoint,
    //     JSON.stringify({
    //       paymentRequestId,
    //       currency: symbol,
    //       quantity,
    //       fixedCurrencyRateToken: rateToken,
    //       ...request,
    //     })
    //   );

    const transaction = createTransaction(prepareTransactionResponse);
    const signedTransaction = await signTransaction(transaction, wallet);
    return {
      signature: signedTransaction,
      token: prepareTransactionResponse.transactionToken,
    };
  }
}
