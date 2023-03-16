import { FormikValues } from 'formik';
import { StreamTimeService } from '@heliofi/sdk';
import {
  CustomerDetails,
  Paystream,
  ProductDetails,
  PaymentRequestType,
} from '@heliofi/common';

import { CreatePaymentService } from '@heliofi/sdk/dist/src/domain/services/CreatePaymentService';
import {
  PaymentDetailsType,
  PaymentFeatures,
} from '../../providers/helio/HelioContext';
import { IHandleSubmit } from './constants';
import { removeUndefinedFields } from '../../utils';

export const getInitialValues = (
  totalDecimalAmount: number,
  canSelectCurrency: boolean,
  getPaymentDetails: <T extends PaymentDetailsType>() => T,
  initialCurrency?: string,
  paymentFeatures?: PaymentFeatures,
  canChangeQuantity?: boolean,
  canChangePrice?: boolean
) => ({
  requireEmail: paymentFeatures?.requireEmail,
  requireDiscordUsername: paymentFeatures?.requireDiscordUsername,
  requireFullName: paymentFeatures?.requireFullName,
  requireTwitterUsername: paymentFeatures?.requireTwitterUsername,
  requirePhoneNumber: paymentFeatures?.requirePhoneNumber,
  requireCountry: paymentFeatures?.requireCountry,
  requireDeliveryAddress: paymentFeatures?.requireDeliveryAddress,
  requireProductDetails: paymentFeatures?.requireProductDetails,
  canChangePrice,
  canChangeQuantity,
  fullName: undefined,
  email: undefined,
  discordUsername: undefined,
  twitterUsername: undefined,
  country: undefined,
  areaCode: '',
  deliveryAddress: undefined,
  city: undefined,
  street: undefined,
  streetNumber: undefined,
  phoneNumber: undefined,
  quantity: canChangeQuantity ? 1 : undefined,
  customPrice: canChangePrice ? undefined : totalDecimalAmount,
  canSelectCurrency,
  currency: canSelectCurrency ? undefined : initialCurrency,
  productValue: undefined,
  interval: getPaymentDetails<Paystream>()?.maxTime
    ? StreamTimeService.getInitialStreamTime({
        intervalType: getPaymentDetails<Paystream>().interval,
        durationSec: getPaymentDetails<Paystream>().maxTime,
      })
    : undefined,
});

export const getCurrency = (currencyList: any[], currency?: string) => {
  if (!currency) return null;
  return currencyList.find((c: any) => c.symbol === currency);
};

export const handleSubmit =
  ({
    paymentDetails,
    HelioSDK,
    totalDecimalAmount,
    onSubmit,
    currencyList,
    paymentType,
  }: IHandleSubmit) =>
  (values: FormikValues) => {
    const details = {
      fullName: values.fullName,
      email: values.email,
      discordUsername: values.discordUsername,
      twitterUsername: values.twitterUsername,
      country: values.country,
      deliveryAddress: values.deliveryAddress,
      city: values.city,
      street: values.street,
      streetNumber: values.streetNumber,
      areaCode: values.areaCode,
      phoneNumber: values.phoneNumber,
    };

    const productDetails = {
      name: paymentDetails?.product?.name,
      value: values.productValue,
    };

    const clearDetails = removeUndefinedFields<CustomerDetails>(details);
    const clearProductDetails =
      removeUndefinedFields<ProductDetails>(productDetails);

    const requestData = {
      customerDetails: clearDetails,
      productDetails: clearProductDetails,
      amount: BigInt(
        HelioSDK.tokenConversionService.convertToMinimalUnits(
          values.currency || paymentDetails?.currency.symbol,
          values.canChangePrice ? values.customPrice : totalDecimalAmount
        )
      ),
      currency: getCurrency(
        currencyList,
        values.currency || paymentDetails?.currency.symbol
      ),
    };

    if (paymentType === PaymentRequestType.PAYLINK) {
      onSubmit({
        ...requestData,
        quantity: BigInt(values.quantity || 1),
      });
    } else if (paymentType === PaymentRequestType.PAYSTREAM) {
      onSubmit({
        ...requestData,
        maxTime: CreatePaymentService.timeToSeconds(
          paymentDetails.interval,
          values.interval
        ),
        interval: CreatePaymentService.timeToSeconds(
          paymentDetails.interval,
          1
        ),
      });
    }
  };

export const formatTotalPrice = (price: number, quantity = 1): number => {
  const totalPrice = Number(price * quantity);
  return totalPrice || price;
};
