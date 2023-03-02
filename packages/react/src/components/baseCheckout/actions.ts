import { FormikValues } from 'formik';
import { CustomerDetails, ProductDetails } from '@heliofi/common';

import { IHandleSubmit } from './constants';
import { removeUndefinedFields } from '../../utils';
import { PaymentFeatures } from '../../providers/helio/HelioContext';

export const getInitialValues = (
  normalizedPrice: number,
  canSelectCurrency: boolean,
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
  customPrice: canChangePrice ? undefined : normalizedPrice,
  canSelectCurrency,
  currency: canSelectCurrency ? undefined : initialCurrency,
  productValue: undefined,
  maxTime: undefined,
});

export const getCurrency = (currencyList: any[], currency?: string) => {
  if (!currency) return null;
  return currencyList.find((c: any) => c.symbol === currency);
};

export const handleSubmit =
  ({
    paymentDetails,
    HelioSDK,
    price,
    onSubmit,
    currencyList,
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

    onSubmit({
      customerDetails: clearDetails,
      productDetails: clearProductDetails,
      amount: BigInt(
        HelioSDK.tokenConversionService.convertToMinimalUnits(
          values.currency || paymentDetails?.currency.symbol,
          values.canChangePrice ? values.customPrice : price
        )
      ),
      quantity: BigInt(values.quantity || 1),
      currency: getCurrency(
        currencyList,
        values.currency || paymentDetails?.currency.symbol
      ),
    });
  };

export const formatTotalPrice = (price: number, quantity = 1): number => {
  const totalPrice = Number((price * quantity).toFixed(3));
  return totalPrice || price;
};
