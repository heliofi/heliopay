import ReactDOM from 'react-dom';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { InfoIcon } from '@heliofi/helio-icons';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import { Modal, InheritedModalProps } from '../modal';
import validationSchema from '../heliopay-container/validation-schema';
import { TokenConversionService } from '../../domain/services/TokenConversionService';
import Input from '../input';
import Button from '../button';
import {
  StyledCurrency,
  StyledCurrencySelectIcon,
  StyledFormText,
  StyledFormTitle,
  StyledPrice,
  StyledProductTooltip,
  StyledProductTooltipIcon,
  StyledProductTooltipText,
  StyledProductWrapper,
} from './styles';
import SelectBox, { Option } from '../selectbox';
import { countries } from '../../domain/constants/countries';
import { now, removeUndefinedFields } from '../../utils';
import { Currency, CustomerDetails } from '../../domain';
import NumberInput from '../numberInput';
import CurrencyIcon from '../currency-icon';
import PhoneNumberInput from '../phoneNumberInput';
import { useAddressProvider } from '../../providers/address/AddressContext';
import AddressSection from '../addressSection';
import { ProductInputType } from '../../domain/model/Product';
import { ProductDetails } from '../../domain/model/ProductDetails';
import { CurrencyService } from '../../domain/services/CurrencyService';
import { useTokenConversion } from '../../providers/token-conversion/TokenConversionContext';

interface Props extends InheritedModalProps {
  onSubmit: (data: {
    amount: number;
    customerDetails?: CustomerDetails;
    productDetails?: ProductDetails;
    quantity: number;
    currency: Currency;
  }) => void;
  allowedCurrencies?: Currency[] | null;
  totalAmount?: number;
  normalizedPrice: number;
  requireFixedCurrency?: boolean;
  fixedPrice?: number;
  fixedCurrency?: string;
}

const CustomerDetailsFormModal = ({
  onHide,
  onSubmit,
  allowedCurrencies,
  totalAmount,
  normalizedPrice,
  fixedPrice,
  fixedCurrency,
  requireFixedCurrency,
}: Props) => {
  const { currencyList, paymentDetails, isCustomerDetailsRequired } =
    useHelioProvider();
  const { country } = useAddressProvider();
  const [activeCurrency, setActiveCurrency] = useState<Currency | null>(null);
  const [selectValue, setSelectValue] = useState({
    label: '',
    value: '',
  });
  const [productDetailsDescriptionShown, setProductDetailsDescriptionShown] =
    useState(false);

  const { tokenExpiration, dynamicRateLoading: priceLoading } =
    useTokenConversion();

  const canSelectCurrency =
    allowedCurrencies?.length != null && allowedCurrencies?.length > 1;

  const currenciesOptions = allowedCurrencies?.map((currency: Currency) => ({
    label: currency?.symbol ?? '',
    value: currency?.symbol ?? '',
    icon: <CurrencyIcon gradient iconName={currency.symbol ?? ''} />,
  }));

  const countryOptions = countries.map((countryItem) => ({
    label: countryItem.name,
    value: countryItem.code,
  }));

  const expirationMS = tokenExpiration ? tokenExpiration * 1000 : 0;

  const isTokenConversionValid: boolean =
    fixedPrice != null &&
    activeCurrency != null &&
    fixedCurrency != null &&
    requireFixedCurrency === true &&
    tokenExpiration != null;

  const getCurrency = (currency?: string) => {
    if (!currency) return null;
    return currencyList.find((c: any) => c.symbol === currency);
  };

  useEffect(() => {
    if (allowedCurrencies?.length === 1) {
      setActiveCurrency(allowedCurrencies[0]);
    } else if (!canSelectCurrency) {
      setActiveCurrency(getCurrency(paymentDetails?.currency?.symbol));
    }
  }, [paymentDetails?.currency, canSelectCurrency]);

  const formatTotalPrice = (price: number, quantity = 1): number => {
    const totalPrice = Number((price * quantity).toFixed(4));
    return totalPrice || price;
  };

  const stringToOptions = (value: string): Option[] => {
    const options = value.split(',');
    return options.map((option) => ({
      label: option,
      value: option,
    }));
  };

  const initialCurrency = paymentDetails?.dynamic
    ? allowedCurrencies?.[0].symbol
    : paymentDetails?.currency?.symbol;

  const initialValues = {
    requireEmail: paymentDetails?.features.requireEmail,
    requireDiscordUsername: paymentDetails?.features.requireDiscordUsername,
    requireFullName: paymentDetails?.features.requireFullName,
    requireTwitterUsername: paymentDetails?.features.requireTwitterUsername,
    requirePhoneNumber: paymentDetails?.features.requirePhoneNumber,
    requireCountry: paymentDetails?.features.requireCountry,
    requireDeliveryAddress: paymentDetails?.features.requireDeliveryAddress,
    requireProductDetails: paymentDetails?.features.requireProductDetails,
    canChangePrice: paymentDetails?.features.canChangePrice,
    canChangeQuantity: paymentDetails?.features.canChangeQuantity,
    fullName: undefined,
    email: undefined,
    discordUsername: undefined,
    twitterUsername: undefined,
    country: country
      ? { label: country.country_name, value: country.country_code }
      : undefined,
    areaCode: '',
    deliveryAddress: undefined,
    city: undefined,
    street: undefined,
    streetNumber: undefined,
    phoneNumber: undefined,
    quantity: paymentDetails?.features.canChangeQuantity ? 1 : undefined,
    customPrice: paymentDetails?.features.canChangePrice
      ? undefined
      : normalizedPrice,
    canSelectCurrency,
    currency: canSelectCurrency ? undefined : initialCurrency,
    productValue: undefined,
  };

  const handleSubmit = (values: any) => {
    const details = {
      fullName: values.fullName,
      email: values.email,
      discordUsername: values.discordUsername,
      twitterUsername: values.twitterUsername,
      country: values.country?.label,
      deliveryAddress: values.deliveryAddress,
      city: values.city,
      street: values.street,
      streetNumber: values.streetNumber,
      areaCode: values.areaCode,
      phoneNumber: values.phoneNumber,
    };

    const productDetails = {
      name: paymentDetails.product?.name,
      value: values.productValue,
    };

    const clearDetails = removeUndefinedFields(details);
    const clearProductDetails = removeUndefinedFields(productDetails);

    onSubmit({
      customerDetails: clearDetails,
      productDetails: clearProductDetails,
      amount: TokenConversionService.convertToMinimalUnits(
        getCurrency(values.currency || paymentDetails?.currency.symbol),
        values.canChangePrice
          ? values.customPrice
          : totalAmount || normalizedPrice
      ),
      quantity: values.quantity || 1,
      currency: getCurrency(values.currency || paymentDetails?.currency.symbol),
    });
  };

  const changeSelectValue = (
    selectObject: Option,
    setFieldValue: (formikId: string, value: string) => void
  ) => {
    setSelectValue({
      label: selectObject.label,
      value: selectObject.value as string,
    });
    setFieldValue('productValue', selectObject.value as string);
  };

  const symbol = activeCurrency ? `Pay with ${activeCurrency?.symbol}` : 'Pay';

  return ReactDOM.createPortal(
    <div>
      <Modal
        onHide={onHide}
        icon={
          activeCurrency && (
            <CurrencyIcon gradient iconName={activeCurrency?.symbol || ''} />
          )
        }
        title={symbol}
      >
        {paymentDetails ? (
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div>
                  {values.canChangePrice ? (
                    <Input
                      fieldId="customPrice"
                      fieldName="customPrice"
                      label="Name your own price"
                      prefix={activeCurrency?.sign}
                      suffix={
                        activeCurrency && (
                          <StyledCurrency>
                            <p>{activeCurrency.symbol}</p>
                            <CurrencyIcon
                              gradient
                              iconName={activeCurrency?.symbol || ''}
                            />
                          </StyledCurrency>
                        )
                      }
                    />
                  ) : priceLoading ? (
                    <StyledPrice>Updating...</StyledPrice>
                  ) : (
                    <StyledPrice>
                      <div>
                        Total price:{' '}
                        <b>
                          {activeCurrency &&
                            CurrencyService.getCurrencyBySymbol(
                              String(activeCurrency?.symbol)
                            )?.symbolPrefix}
                          {formatTotalPrice(
                            totalAmount || normalizedPrice,
                            values.quantity
                          )}{' '}
                          {activeCurrency?.symbol}
                          {fixedPrice && requireFixedCurrency && fixedCurrency && (
                            <span>
                              {' '}
                              (
                              {
                                CurrencyService.getCurrencyBySymbol(
                                  String(fixedCurrency)
                                )?.symbolPrefix
                              }
                              {formatTotalPrice(
                                TokenConversionService.convertFromMinimalUnits(
                                  CurrencyService.getCurrencyBySymbol(
                                    String(fixedCurrency)
                                  ),
                                  fixedPrice
                                ),
                                values.quantity
                              )}{' '}
                              {fixedCurrency})
                            </span>
                          )}
                        </b>
                      </div>
                      {!priceLoading && isTokenConversionValid && (
                        <CountdownCircleTimer
                          isPlaying
                          duration={(expirationMS - now()) / 1000}
                          colors="#F76C1B"
                          trailColor="#FFEAD2"
                          size={16}
                          strokeWidth={3}
                          onComplete={() => ({
                            shouldRepeat: true,
                          })}
                        />
                      )}
                    </StyledPrice>
                  )}
                  {canSelectCurrency && (
                    <SelectBox
                      options={currenciesOptions || []}
                      placeholder="Select currency"
                      value={values.currency}
                      showValidations
                      fieldName="currency"
                      label="Currency"
                      prefix={
                        values.currency && (
                          <StyledCurrencySelectIcon>
                            <CurrencyIcon gradient iconName={values.currency} />
                          </StyledCurrencySelectIcon>
                        )
                      }
                      onChange={(option) => {
                        setFieldValue('currency', option.value);
                        setActiveCurrency(getCurrency(option.value as string));
                      }}
                    />
                  )}
                  {paymentDetails?.features?.canChangeQuantity && (
                    <NumberInput
                      fieldId="quantity"
                      fieldName="quantity"
                      setFieldValue={setFieldValue}
                      value={values.quantity}
                      placeholder="Quantity"
                      label="Quantity"
                    />
                  )}
                  {isCustomerDetailsRequired && (
                    <>
                      <StyledFormTitle>Information required</StyledFormTitle>
                      <StyledFormText>
                        We need some information from you to deliver the
                        product.
                      </StyledFormText>
                    </>
                  )}
                  {paymentDetails?.features.requireFullName && (
                    <Input
                      fieldId="fullName"
                      fieldName="fullName"
                      placeholder="Full name"
                      label="Full name"
                    />
                  )}
                  {paymentDetails?.features.requireEmail && (
                    <Input
                      fieldId="email"
                      fieldName="email"
                      placeholder="john@helio.co"
                      label="E-mail address"
                    />
                  )}

                  {paymentDetails?.features.requireTwitterUsername && (
                    <Input
                      fieldId="twitterUsername"
                      fieldName="twitterUsername"
                      placeholder="@helio_pay"
                      label="Twitter username"
                    />
                  )}

                  {paymentDetails?.features.requireDiscordUsername && (
                    <Input
                      fieldId="discordUsername"
                      fieldName="discordUsername"
                      placeholder="Helio#1234"
                      label="Discord username"
                    />
                  )}

                  {paymentDetails?.features?.requirePhoneNumber && (
                    <PhoneNumberInput
                      fieldId="phoneNumber"
                      fieldName="phoneNumber"
                      label="Phone number"
                      onChange={(value) => {
                        setFieldValue('phoneNumber', value);
                      }}
                    />
                  )}
                  {paymentDetails?.features.requireCountry && (
                    <SelectBox
                      options={countryOptions}
                      placeholder="Select country"
                      value={values.country?.label}
                      showValidations
                      fieldName="country"
                      label="Country"
                      onChange={(option) => setFieldValue('country', option)}
                    />
                  )}

                  {paymentDetails?.features.requireDeliveryAddress && (
                    <AddressSection
                      setFieldValue={setFieldValue}
                      areaCodeValue={values.areaCode}
                      countryCode={values.country?.value}
                    />
                  )}
                  {paymentDetails?.features?.requireProductDetails &&
                    paymentDetails?.product != null &&
                    (paymentDetails?.product?.type ===
                    ProductInputType.SELECTOR ? (
                      <SelectBox
                        value={selectValue.value}
                        label={paymentDetails?.product.name}
                        placeholder="Select"
                        fieldName="productValue"
                        onChange={(value) =>
                          changeSelectValue(value, setFieldValue)
                        }
                        options={stringToOptions(
                          paymentDetails?.product?.description
                        )}
                      />
                    ) : (
                      <StyledProductWrapper className="relative">
                        <Input
                          fieldId="productValue"
                          fieldName="productValue"
                          placeholder="Insert data here..."
                          label={paymentDetails?.product.name}
                          labelSuffix={
                            <>
                              {productDetailsDescriptionShown && (
                                <StyledProductTooltip className="absolute right-0 -top-[35px]">
                                  <StyledProductTooltipText className="mr-0 ml-auto w-fit max-w-full overflow-hidden rounded bg-black p-2 text-[11px] text-h20">
                                    {paymentDetails?.product.description}
                                  </StyledProductTooltipText>
                                </StyledProductTooltip>
                              )}
                              <StyledProductTooltipIcon
                                onMouseLeave={() =>
                                  setProductDetailsDescriptionShown(false)
                                }
                                onMouseEnter={() =>
                                  setProductDetailsDescriptionShown(true)
                                }
                              >
                                <InfoIcon />
                              </StyledProductTooltipIcon>
                            </>
                          }
                        />
                      </StyledProductWrapper>
                    ))}
                  <Button type="submit">PAY</Button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <h2>Failed to load payment details.</h2>
        )}
      </Modal>
    </div>,
    document.body
  );
};

export default CustomerDetailsFormModal;
