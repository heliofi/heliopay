import { PaymentEvent } from './PaymentEvent';
import type {
  ApproveTransactionResponse,
  CreatePaystreamResponse,
  CancelStreamResponse,
} from '../../infrastructure';

export interface SuccessPaymentEvent<
  T =
    | ApproveTransactionResponse
    | CreatePaystreamResponse
    | CancelStreamResponse
> extends PaymentEvent {
  data: T;
  transaction: string;
  paymentPK?: string;
  swapTransactionSignature?: string;
}
