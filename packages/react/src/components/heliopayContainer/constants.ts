import { Currency, CustomerDetails, ProductDetails } from '@heliofi/common';

export type SubmitPaymentProps = {
  amount: bigint;
  currency: Currency;
  customerDetails?: CustomerDetails;
  productDetails?: ProductDetails;
};

export type SubmitPaylinkProps = SubmitPaymentProps & {
  quantity: bigint;
};

export type SubmitPaystreamProps = SubmitPaymentProps & {
  interval: number;
  maxTime: number;
};

export type SubmitPaymentsTypesProps =
  | SubmitPaylinkProps
  | SubmitPaystreamProps;
