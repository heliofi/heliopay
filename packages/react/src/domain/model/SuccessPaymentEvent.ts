import { PaymentEvent } from './PaymentEvent';
import {ApproveTransactionResponse} from "../../infrastructure/solana-utils/payment/paylink/PaylinkSubmitService";

export interface SuccessPaymentEvent<T = ApproveTransactionResponse> extends PaymentEvent {
  data: T;
  transaction: string;
  paymentPK?: string;

  swapTransaction?: string;
}
