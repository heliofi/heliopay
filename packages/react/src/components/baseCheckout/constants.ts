import { FormikValues } from 'formik';
import { HelioSDK as HelioSDKType } from '@heliofi/sdk';
import { Currency, PaymentRequestType } from '@heliofi/common';

import { SubmitPaymentsTypesProps } from '../heliopayContainer/constants';

export type InheritedOnSubmit = (
  data: SubmitPaymentsTypesProps
) => Promise<void>;

export type InheritedBaseCheckoutProps = {
  onHide: () => void;
  onSubmit: InheritedOnSubmit;
  allowedCurrencies: Currency[];
  totalAmount?: number;
};

export type FormikSetFieldValue = (
  field: string,
  value: any,
  shouldValidate?: boolean
) => void;

export type FormikProps = {
  formValues: FormikValues;
  setFieldValue: FormikSetFieldValue;
};

export interface IHandleSubmit {
  paymentDetails?: any;
  HelioSDK: HelioSDKType;
  price: number;
  onSubmit: InheritedOnSubmit;
  currencyList: Currency[];
  paymentType: PaymentRequestType;
}
// @todo-v check
export type CheckoutFormInitialValuesType = {
  requireEmail?: boolean;
  requireDiscordUsername?: boolean;
  requireFullName?: boolean;
  requireTwitterUsername?: boolean;
  requireCountry?: boolean;
  requireDeliveryAddress?: boolean;
  requirePhoneNumber?: boolean;
  requireProductDetails?: boolean;
  canChangePrice?: boolean;
  canChangeQuantity?: boolean;
  requireQuantityLimits?: boolean;
  minQuantity?: number;
  maxQuantity?: number;
  requireMaxTransactions?: boolean;
  transactionsLeft?: number;
  fullName?: string;
  email?: string;
  discordUsername?: string;
  twitterUsername?: string;
  country?: { label: string; value: string };
  phoneNumber?: string;
  productValue?: string;
  quantity?: number;
  customPrice?: number;
  maxTime: number;
  areaCode?: string;
  state?: string;
  deliveryAddress?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
  swapsCurrency?: string;
};
