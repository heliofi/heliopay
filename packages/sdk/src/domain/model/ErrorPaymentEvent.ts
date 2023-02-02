import { PaymentEvent } from './PaymentEvent';

export interface ErrorPaymentEvent extends PaymentEvent {
  errorMessage: string;
}
