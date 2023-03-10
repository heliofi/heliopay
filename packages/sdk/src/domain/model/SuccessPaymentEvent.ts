import { PaymentEvent } from './PaymentEvent';
import type {
  ApproveTransactionResponse,
  CreatePaystreamResponse,
} from '../../infrastructure';

export interface SuccessPaymentEvent<
  T = ApproveTransactionResponse | CreatePaystreamResponse
> extends PaymentEvent {
  data: T;
  transaction: string;
  paymentPK?: string;
  swapTransactionSignature?: string;
}
