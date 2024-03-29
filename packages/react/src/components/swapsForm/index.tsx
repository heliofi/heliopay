import React, { useEffect, useState } from 'react';
import { FormikValues } from 'formik';

import { roundValue } from '../../utils';
import { useDebounce } from '../../hooks/useDebounce';
import { CurrencyIcon, SelectBox } from '../../ui-kits';
import Spinner from '../../assets/placeholders/LoadingSpinner';
import { FormikSetFieldValue } from '../baseCheckout/constants';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import { useHelioProvider } from '../../providers/helio/HelioContext';

import {
  StyledCurrencySelectIcon,
  StyledSpinner,
  StyledSwapError,
  StyledSwapsContainer,
  StyledTokenSwapQuoteInfo,
} from './styles';

interface SwapsFormProps {
  formValues: FormikValues;
  setFieldValue: FormikSetFieldValue;
  totalDecimalAmount: number;
}

const DEBOUNCE_TIME = 500;

const SwapsForm = ({
  formValues,
  setFieldValue,
  totalDecimalAmount,
}: SwapsFormProps) => {
  const {
    paymentDetails,
    tokenSwapLoading,
    tokenSwapCurrencies,
    getTokenSwapCurrencies,
    tokenSwapQuote,
    getTokenSwapQuote,
    tokenSwapError,
    currencyList,
    paymentType,
    activeCurrency,
  } = useHelioProvider();

  const { HelioSDK } = useCompositionRoot();

  const [selectedCurrency, setSelectedCurrency] = useState(
    tokenSwapCurrencies?.find(
      ({ symbol }) => symbol === formValues.swapsCurrency
    )
  );

  const debouncedQuantity = useDebounce(formValues.quantity, DEBOUNCE_TIME);
  const debouncedPrice = useDebounce(formValues.price, DEBOUNCE_TIME);

  useEffect(() => {
    getTokenSwapCurrencies();
  }, [paymentDetails?.currency?.mintAddress]);

  useEffect(() => {
    const currency = currencyList?.find(
      (it) => formValues.currency === it.symbol
    );

    if (
      selectedCurrency?.mintAddress != null &&
      paymentDetails?.id &&
      paymentType
    ) {
      getTokenSwapQuote(
        paymentDetails.id,
        paymentType,
        selectedCurrency.mintAddress,
        formValues.quantity,
        totalDecimalAmount,
        paymentDetails?.dynamic ? currency?.mintAddress : undefined
      );
    }
  }, [
    selectedCurrency,
    debouncedQuantity,
    debouncedPrice,
    paymentDetails?.currency.mintAddress,
    activeCurrency,
    paymentDetails?.id,
    paymentType,
    formValues.interval,
  ]);

  const currencyOptions =
    tokenSwapCurrencies
      ?.filter(
        ({ mintAddress, symbol }) =>
          mintAddress != null && symbol !== activeCurrency?.symbol
      )
      .map((currency) => ({
        value: currency.symbol,
        label: `${currency.symbol}`,
        icon: <CurrencyIcon gradient iconName={currency.symbol} />,
      })) || [];

  const getCurrencyLabel = (): string => {
    let currencyLabel = selectedCurrency
      ? `${selectedCurrency?.symbol}`
      : 'Select currency';

    if (tokenSwapQuote != null && selectedCurrency != null && !tokenSwapError) {
      currencyLabel = `${HelioSDK.tokenConversionService.convertFromMinimalAndRound(
        selectedCurrency?.symbol,
        BigInt(tokenSwapQuote?.inAmount)
      )} ${selectedCurrency?.symbol}`;
    }

    return currencyLabel;
  };
  console.log(tokenSwapQuote);
  return (
    <StyledSwapsContainer>
      {tokenSwapLoading ? (
        <StyledSpinner>
          <Spinner />
        </StyledSpinner>
      ) : (
        <div>
          <div>
            <SelectBox
              label="Paying in"
              options={currencyOptions}
              value={getCurrencyLabel()}
              fieldName="swapsCurrency"
              showValidations
              onChange={(option) => {
                setFieldValue('swapsCurrency', option.value);
                setSelectedCurrency(
                  HelioSDK.currencyService.getCurrencyBySymbol(
                    String(option.value)
                  )
                );
              }}
              placeholder="Select currency"
              prefix={
                selectedCurrency?.symbol ? (
                  <StyledCurrencySelectIcon>
                    <CurrencyIcon
                      iconName={formValues.swapsCurrency}
                      gradient
                    />
                  </StyledCurrencySelectIcon>
                ) : undefined
              }
            />
          </div>
          {tokenSwapError && (
            <StyledSwapError>
              No routes available for selected currency. Please use another
              token
            </StyledSwapError>
          )}
          {tokenSwapQuote != null && !tokenSwapError && (
            <div>
              <StyledTokenSwapQuoteInfo>
                <p>Price impact:</p>
                <p>{roundValue(tokenSwapQuote.priceImpactPct, 3)}%</p>
              </StyledTokenSwapQuoteInfo>
              <StyledTokenSwapQuoteInfo>
                <p>Exchange rate:</p>
                <p>
                  1 {activeCurrency?.symbol} ={' '}
                  {roundValue(
                    HelioSDK.tokenConversionService.convertFromMinimalUnits(
                      tokenSwapQuote.from.symbol,
                      BigInt(tokenSwapQuote.inAmount)
                    ) /
                      HelioSDK.tokenConversionService.convertFromMinimalUnits(
                        tokenSwapQuote.to.symbol,
                        BigInt(tokenSwapQuote.outAmount)
                      ),
                    4
                  )}{' '}
                  {selectedCurrency?.symbol}
                </p>
              </StyledTokenSwapQuoteInfo>
            </div>
          )}
        </div>
      )}
    </StyledSwapsContainer>
  );
};

export default SwapsForm;
