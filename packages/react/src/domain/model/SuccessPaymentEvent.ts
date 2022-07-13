import { PaymentEvent } from './PaymentEvent';

export interface SuccessPaymentEvent extends PaymentEvent {
  content: string;
  transaction: string;
}
