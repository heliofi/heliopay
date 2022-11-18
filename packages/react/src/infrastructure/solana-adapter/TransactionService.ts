import {
  HelioIdl,
  SinglePaymentRequest,
  singlePayment,
  singleSolPayment,
} from '@heliofi/solana-adapter';
import { Program } from '@project-serum/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import { SplitWallet } from '@heliofi/common';
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
import { CurrencyService } from '../../domain/services/CurrencyService';
import {
  getHelioApiBaseUrl,
  HelioApiAdapter,
} from '../helio-api/HelioApiAdapter';
import { ProductDetails } from '../../domain/model/ProductDetails';
import { getAssociatedTokenAddress } from '@solana/spl-token';

const SOL_SYMBOL = 'SOL';

type PaylinkRequest = SinglePaymentRequest & {
  splitRevenue?: boolean;
  splitWallets?: SplitWallet[];
};

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
  productDetails?: ProductDetails;
  quantity?: number;
  cluster: Cluster;
  accounts?: any;
}

const approveTransaction = async (
  cluster: Cluster,
  reqBody: ApproveTransactionPayload
): Promise<string> => {
  const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
  const res = await fetch(`${HELIO_BASE_API_URL}/approve-transaction`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(reqBody),
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

const checkHelioX = async (
  recipientPK: string,
  cluster: Cluster
): Promise<{ isHelioX: boolean }> => {
  const HELIO_BASE_API_URL = getHelioApiBaseUrl(cluster);
  const res = await fetch(`${HELIO_BASE_API_URL}/wallet/${recipientPK}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
    },
  });
  const result = await res.json();
  if (res.status === HttpCodes.SUCCESS) {
    return {
      isHelioX: result.isHelioX,
    };
  }
  return {
    isHelioX: false,
  };
};

const sendTransaction = async (
  symbol: string,
  request: SinglePaymentRequest,
  provider: Program<HelioIdl>,
  isHeliox: boolean,
  splitRevenue: boolean,
  amounts?: number[],
  accounts?: PublicKey[]
): Promise<string | undefined> => {
  try {
    if (splitRevenue && amounts && accounts) {
      if (symbol === SOL_SYMBOL) {
        return await singleSolPayment(
          provider,
          request,
          !isHeliox,
          amounts,
          accounts
        );
      }
      return await singlePayment(
        provider,
        request,
        !isHeliox,
        amounts,
        accounts
      );
    }
    if (symbol === SOL_SYMBOL) {
      return await singleSolPayment(provider, request, !isHeliox);
    }
    return await singlePayment(provider, request, !isHeliox);
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

const calculateSplitAmounts = async (
  request: PaylinkRequest,
  isDefaultTransaction = false
): Promise<{
  amounts: number[];
  firstAmount: number;
  accounts: PublicKey[];
}> => {
  const amounts: number[] = [];
  const accounts: PublicKey[] = [];
  let firstAmount = 0;
  let index = 0;

  for (const wallet of request.splitWallets as SplitWallet[]) {
    if (wallet.sharePercent === 0) continue;

    const amount = (request.amount * wallet.sharePercent) / 100;
    const recipient = new PublicKey(wallet.address);

    if (index === 0) {
      firstAmount = amount;
      request.recipient = recipient;
    } else {
      amounts.push(amount);
      accounts.push(recipient);

      if (isDefaultTransaction) {
        const recipientTokenAccount = await getAssociatedTokenAddress(
          request.mintAddress,
          recipient
        );
        accounts.push(recipientTokenAccount);
      }
    }
    index++;
  }

  return { firstAmount, amounts, accounts };
};

export const createOneTimePayment = async ({
  anchorProvider,
  recipientPK,
  symbol,
  amount,
  paymentRequestId,
  customerDetails,
  productDetails,
  quantity,
  onSuccess,
  onError,
  onPending,
  cluster,
}: Props): Promise<void> => {
  const mintAddress = CurrencyService.getCurrencyBySymbol(symbol)
    .mintAddress as string;
  const request = await HelioApiAdapter.getPaymentRequestByIdPublic(
    paymentRequestId,
    cluster
  );
  request.mintAddress = new PublicKey(
    CurrencyService.getCurrencyBySymbol(symbol).mintAddress as string
  );

  const { isHelioX } = await checkHelioX(recipientPK, cluster);

  const sendTransactionPayload: {
    symbol: string;
    request: SinglePaymentRequest;
    anchorProvider: Program<HelioIdl>;
    isHelioX: boolean;
    isSplitRevenue: boolean;
    amounts?: number[];
    accounts?: PublicKey[];
  } = {
    symbol,
    request: {
      amount,
      sender: anchorProvider.provider.publicKey as PublicKey,
      recipient: new PublicKey(recipientPK),
      mintAddress: new PublicKey(mintAddress),
      cluster,
    },

    anchorProvider,
    isHelioX,
    isSplitRevenue: !!request?.features?.splitRevenue,
  };


  if (
    request?.features?.splitRevenue &&
    request?.splitWallets &&
    request?.splitWallets.length > 0
  ) {
    const { firstAmount, amounts, accounts } = await calculateSplitAmounts(
      {
        ...sendTransactionPayload.request,
        splitWallets: request.splitWallets,
      },
      symbol !== SOL_SYMBOL
    );
    sendTransactionPayload.amounts = amounts;
    sendTransactionPayload.accounts = accounts;
    sendTransactionPayload.request.amount = firstAmount;
  }

  const signature = await sendTransaction(
    sendTransactionPayload.symbol,
    sendTransactionPayload.request,
    sendTransactionPayload.anchorProvider,
    sendTransactionPayload.isHelioX,
    sendTransactionPayload.isSplitRevenue,
    sendTransactionPayload?.amounts,
    sendTransactionPayload?.accounts
  );


  if (signature === undefined) {
    onError?.({ errorMessage: 'Failed to send transaction.' });
    return;
  }

  const finalProductDetails =
    Object.keys(productDetails || {}).length === 0 ? undefined : productDetails;


  const approveTransactionPayload: ApproveTransactionPayload = {
    transactionSignature: signature,
    paymentRequestId,
    amount,
    sender: anchorProvider?.provider?.publicKey?.toBase58() as string,
    recipient: recipientPK,
    currency: symbol,
    cluster,
    customerDetails,
    quantity,
    productDetails: finalProductDetails,
    splitRevenue: !!request?.features?.splitRevenue,
    splitWallets: request?.splitWallets,
  };

  try {
    approveTransactionPayload.transactionSignature = signature;
    const content = await approveTransaction(
      cluster,
      approveTransactionPayload
    );
    onSuccess?.({ transaction: signature, content });
  } catch (e) {
    const errorHandler = (message: string) => {
      onError?.({ errorMessage: message, transaction: signature });
    };
    if (e instanceof VerificationError) {
      onPending?.({ transaction: signature });
      await retryCallback(
        async () => {
          const content = await approveTransaction(
            cluster,
            approveTransactionPayload
          );
          onSuccess?.({ transaction: signature, content });
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
