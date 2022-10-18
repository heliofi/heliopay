import {
  HelioIdl,
  SinglePaymentRequest,
  singlePayment,
  singleSolPayment,
  getSinglePaymentSignedTx
} from '@heliofi/solana-adapter';
import { Program, Wallet } from '@project-serum/anchor';
import { Cluster, Connection, PublicKey } from '@solana/web3.js';

import {
  CustomerDetails,
  ErrorPaymentEvent,
  HttpCodes,
  PendingPaymentEvent,
  SuccessPaymentEvent
} from '../../domain';
import { TransactionTimeoutError } from './TransactionTimeoutError';
import { VerificationError } from './VerificationError';
import { ApproveTransactionPayload } from './ApproveTransactionPayload';
import { CurrencyService } from '../../domain/services/CurrencyService';
import { getHelioApiBaseUrl } from '../helio-api/HelioApiAdapter';
import { CheckoutReqPayload } from '../../domain/model/CheckoutRequestPayload';

const SOL_SYMBOL = 'SOL';

interface Props {
  anchorProvider: Program<HelioIdl>;
  recipientPK: string;
  symbol: string;
  amount: number;
  paymentRequestId: string;
  onSuccess?: (event: SuccessPaymentEvent) => void;
  onError?: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
  customerDetails?: CustomerDetails;
  quantity?: number;
  cluster: Cluster;
  connection: Connection;
  wallet: Wallet;
}

export const approveTransaction = async (
  reqBody: ApproveTransactionPayload
): Promise<string> => {
  const HELIO_BASE_API_URL = 'https://api.hel.io/v1';
  const res = await fetch(`${HELIO_BASE_API_URL}/approve-transaction`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  });
  const result = await res.json();
  if (
    (res.status === HttpCodes.SUCCESS ||
      res.status === HttpCodes.CREATED_SUCCESS) &&
    result.content != null
  ) {
    return result.content;
  }
  if (res.status === HttpCodes.FAILED_DEPENDENCY) {
    throw new VerificationError(
      `Error comfirming transaction integrity, ${result.message}`
    );
  }
  throw new Error(result.message);
};

export const checkoutTransaction = async (
  reqBody: CheckoutReqPayload
): Promise<{
  content?: string;
  transactionSignature?: string;
  message?: string;
}> => {
  const HELIO_BASE_API_URL = getHelioApiBaseUrl(reqBody.cluster);
  const res = await fetch(`${HELIO_BASE_API_URL}/breakpoint/checkout`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(reqBody)
  });
  const result = await res.json();
  if (
    res.status === HttpCodes.SUCCESS ||
    res.status === HttpCodes.CREATED_SUCCESS
  ) {
    return result;
  }
  if (res.status === HttpCodes.FAILED_DEPENDENCY) {
    throw new VerificationError(result.message);
  }
  throw new Error(result.message);
};

export const signTransaction = async (
  symbol: string,
  request: SinglePaymentRequest,
  provider: Program<HelioIdl>
): Promise<string | undefined> => {
  try {
    if (symbol === SOL_SYMBOL) {
      return await singleSolPayment(provider, request, true); //True to sign fees
    }
    return await singlePayment(provider, request, true);
  } catch (e) {
    return new TransactionTimeoutError(String(e)).extractSignature();
  }
};

export const retryCallback = async (
  callback: () => Promise<void>,
  count: number,
  delay: number,
  onError: (message: string) => void
): Promise<void> => {
  if (count < 0) {
    onError('Unable to verify the transaction.');
    return;
  }
  try {
    await callback();
  } catch (e) {
    if (e instanceof VerificationError) {
      setTimeout(async () => {
        await retryCallback(callback, count - 1, delay, onError);
      }, delay);
    } else {
      onError(String(e));
    }
  }
};

export const createOneTimePayment = async ({
  anchorProvider,
  recipientPK,
  symbol,
  amount,
  paymentRequestId,
  customerDetails,
  quantity,
  onSuccess,
  onError,
  onPending,
  connection,
  wallet,
  cluster
}: Props): Promise<void> => {
  const mintAddress = CurrencyService.getCurrencyBySymbol(symbol)
    .mintAddress as string;

  const request: SinglePaymentRequest = {
    amount,
    sender: anchorProvider.provider.publicKey as PublicKey,
    recipient: new PublicKey(recipientPK),
    mintAddress: new PublicKey(mintAddress),
    cluster
  };

  const signedTx = await getSinglePaymentSignedTx(
    connection,
    wallet,
    anchorProvider,
    request,
    false // Sign fees
  );

  if (!signedTx) {
    onError?.({ errorMessage: 'Failed to sign transaction' });
    return;
  }

  const transactionPayload: CheckoutReqPayload = {
    paymentRequestId,
    amount,
    sender: anchorProvider?.provider?.publicKey?.toBase58() as string,
    recipient: recipientPK,
    currency: symbol,
    cluster,
    customerDetails,
    quantity,
    signedTx
  };

  try {
    console.log('sending');
    const paymentResult = await checkoutTransaction(transactionPayload);
    console.log(paymentResult);
    onSuccess?.({
      transaction: paymentResult?.transactionSignature ?? '',
      content: paymentResult?.content ?? ''
    });
  } catch (e) {
    const errorHandler = (message: string) => {
      onError?.({ errorMessage: message, transaction: signedTx });
    };

    if (e instanceof VerificationError) {
      onPending?.({ transaction: signedTx });
      await retryCallback(
        async () => {
          const paymentResult = await checkoutTransaction(transactionPayload);
          onSuccess?.({
            transaction: paymentResult?.transactionSignature ?? '',
            content: paymentResult?.content ?? ''
          });
        },
        20,
        5_000,
        errorHandler
      );
    } else {
      errorHandler(String(e));
    }
  }
};
