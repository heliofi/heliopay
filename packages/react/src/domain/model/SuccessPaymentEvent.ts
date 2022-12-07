import { PaymentEvent } from './PaymentEvent';

export interface SuccessPaymentEvent<T> extends PaymentEvent {
  data: T;
  transaction: string;
  paymentPK?: string;
}
