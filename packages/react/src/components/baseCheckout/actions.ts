import { FormikValues } from 'formik';
import {
  StreamTimeService,
  CreatePaymentService,
  HelioSDK as HelioSDKType,
  TokenSwapQuote,
} from '@heliofi/sdk';
import {
  CustomerDetails,
  Paystream,
  ProductDetails,
  PaymentRequestType,
  Currency,
  BlockchainSymbol,
} from '@heliofi/common';
import {
  PaymentDetailsType,
  PaymentFeatures,
} from '../../providers/helio/HelioContext';
import { CheckoutFormInitialValuesType, IHandleSubmit } from './constants';
import { removeUndefinedFields } from '../../utils';
import { CheckoutSearchParamsValues } from '../../domain/services/CheckoutSearchParams';

export const getInitialValues = (
  totalDecimalAmount: number,
  canSelectCurrency: boolean,
  getPaymentDetails: <T extends PaymentDetailsType>() => T,
  initialCurrency?: string,
  paymentFeatures?: PaymentFeatures,
  canChangeQuantity?: boolean,
  canChangePrice?: boolean,
  searchParams?: CheckoutSearchParamsValues
): CheckoutFormInitialValuesType => ({
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
  ...searchParams,
});

export const handleSubmit =
  ({
    paymentDetails,
    HelioSDK,
    totalDecimalAmount,
    onSubmit,
    currency,
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
          currency.symbol,
          values.canChangePrice ? values.customPrice : totalDecimalAmount
        )
      ),
      currency,
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

export const getIsBalanceEnough = ({
  HelioSDK,
  customPrice,
  quantity,
  activeCurrency,
  paymentDetails,
  blockchain,
  canSwapTokens,
  tokenSwapQuote,
}: {
  HelioSDK: HelioSDKType;
  customPrice?: number;
  quantity?: number;
  activeCurrency?: Currency;
  paymentDetails?: PaymentDetailsType;
  blockchain?: BlockchainSymbol;
  canSwapTokens?: boolean;
  tokenSwapQuote?: TokenSwapQuote;
}): boolean => {
  if (!activeCurrency?.symbol || !paymentDetails?.normalizedPrice) {
    return true;
  }

  return HelioSDK.availableBalanceService.isBalanceEnough({
    quantity,
    decimalAmount:
      customPrice ||
      HelioSDK.tokenConversionService.convertFromMinimalUnits(
        activeCurrency.symbol,
        paymentDetails.normalizedPrice,
        blockchain
      ),
    isTokenSwapped: !!(canSwapTokens && tokenSwapQuote?.from?.symbol),
  });
};
