import { FormikValues } from 'formik';
import { HelioSDK as HelioSDKType } from '@heliofi/sdk';
import { Currency, PaymentRequestType } from '@heliofi/common';

import { SubmitPaymentsTypesProps } from '../heliopayContainer/constants';

export const NOT_ENOUGH_FUNDS_TOOLTIP = 'Not enough funds in your wallet';

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
  totalDecimalAmount: number;
  onSubmit: InheritedOnSubmit;
  currencyList: Currency[];
  paymentType: PaymentRequestType;
}

export type CheckoutFormInitialValuesType = {
  requireEmail?: boolean;
  requireDiscordUsername?: boolean;
  requireFullName?: boolean;
  requireTwitterUsername?: boolean;
  requirePhoneNumber?: boolean;
  requireCountry?: boolean;
  requireDeliveryAddress?: boolean;
  requireProductDetails?: boolean;
  canChangePrice?: boolean;
  canChangeQuantity?: boolean;
  fullName?: string;
  email?: string;
  discordUsername?: string;
  twitterUsername?: string;
  country?: { label: string; value: string };
  areaCode?: string;
  deliveryAddress?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
  phoneNumber?: string;
  quantity?: number;
  customPrice?: number;
  canSelectCurrency?: boolean;
  currency?: string;
  productValue?: string;
  interval?: number;
};
