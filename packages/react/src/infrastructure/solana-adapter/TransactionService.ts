import {
  HelioIdl,
  SinglePaymentRequest,
  singlePaymentSC,
  singleSolPaymentSC,
} from '@heliofi/solana-adapter';
import { Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';

import {
  CustomerDetails,
  ErrorPaymentEvent,
  HttpCodes,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../domain';
import { TransactionTimeoutError } from './TransactionTimeoutError';
import { VerificationError } from './VerificationError';
import { ApproveTransactionPayload } from './ApproveTransactionPayload';
import { cluster, helioApiBaseUrl } from '../config';
import { getMintAddressByCluster } from '../../domain/constants/currency';

const SOL_SYMBOL = 'SOL';

interface Props {
  anchorProvider: Program<HelioIdl>;
  recipientPK: string;
  symbol: string;
  amount: number;
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  customerDetails?: CustomerDetails;
  quantity?: number;
}

const approveTransaction = async (
  reqBody: ApproveTransactionPayload
): Promise<string> => {
  const res = await fetch(`${helioApiBaseUrl}/approve-transaction`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  });
  const result = await res.json();
  if (res.status === HttpCodes.SUCCESS && result.content != null) {
    return result.content;
  }
  if (res.status === HttpCodes.FAILED_DEPENDENCY) {
    throw new VerificationError(result.message);
  }
  throw new Error(result.message);
};

const sendTransaction = async (
  symbol: string,
  request: SinglePaymentRequest,
  provider: Program<HelioIdl>
): Promise<string | undefined> => {
  try {
    if (symbol === SOL_SYMBOL) {
      return await singleSolPaymentSC(provider, request);
    }
    return await singlePaymentSC(provider, request);
  } catch (e) {
    return new TransactionTimeoutError(String(e)).extractSignature();
  }
};

const retryCallback = async (
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
}: Props): Promise<void> => {
  const mintAddress = getMintAddressByCluster(cluster, symbol);
  const signature = await sendTransaction(
    symbol,
    {
      amount,
      sender: anchorProvider.provider.wallet.publicKey,
      recipient: new PublicKey(recipientPK),
      mintAddress: new PublicKey(mintAddress),
      cluster,
    },
    anchorProvider
  );

  if (signature === undefined) {
    onError({ errorMessage: 'Failed to send transaction' });
    return;
  }

  const approveTransactionPayload: ApproveTransactionPayload = {
    transactionSignature: signature,
    paymentRequestId,
    amount,
    sender: anchorProvider.provider.wallet.publicKey.toBase58(),
    recipient: recipientPK,
    currency: symbol,
    cluster,
    customerDetails,
    quantity,
  };

  try {
    approveTransactionPayload.transactionSignature = signature;
    const content = await approveTransaction(approveTransactionPayload);
    onSuccess({ transaction: signature, content });
  } catch (e) {
    const errorHandler = (message: string) => {
      onError({ errorMessage: message, transaction: signature });
    };
    if (e instanceof VerificationError) {
      onPending({ transaction: signature });
      await retryCallback(
        async () => {
          const content = await approveTransaction(approveTransactionPayload);
          onSuccess({ transaction: signature, content });
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
