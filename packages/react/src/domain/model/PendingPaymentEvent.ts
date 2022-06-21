import { PaymentEvent } from './PaymentEvent';

export interface PendingPaymentEvent extends PaymentEvent {
  transaction: string;
}
