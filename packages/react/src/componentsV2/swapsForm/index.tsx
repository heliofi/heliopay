import React, { useEffect, useState } from 'react';
import { FormikValues } from 'formik';
import { Currency, PaymentRequestType } from '@heliofi/common';

import { useHelioProvider } from '../../providers/helio/HelioContext';
import { CurrencyIcon, SelectBox } from '../../ui-kits';
import { useDebounce } from '../../hooks/useDebounce';
import Spinner from '../../assets/placeholders/LoadingSpinner';
import { roundValue } from '../../utils';
import { useCompositionRoot } from '../../hooks/compositionRoot';

import {
  StyledCurrencySelectIcon,
  StyledSpinner,
  StyledSwapError,
  StyledSwapsContainer,
  StyledTokenSwapQuoteInfo,
} from './styles';

interface SwapsFormProps {
  formValues: FormikValues;
  setFieldValue: (field: string, value: unknown) => void;
  normalizedPrice: number;
}

const DEBOUNCE_TIME = 500;

const SwapsForm = ({
  formValues,
  setFieldValue,
  normalizedPrice,
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

    if (selectedCurrency?.mintAddress != null) {
      getTokenSwapQuote(
        paymentDetails.id,
        'PAYLINK' as PaymentRequestType.PAYLINK,
        selectedCurrency.mintAddress,
        formValues.quantity,
        normalizedPrice,
        paymentDetails?.dynamic ? currency?.mintAddress : undefined
      );
    }
  }, [
    selectedCurrency,
    debouncedQuantity,
    debouncedPrice,
    paymentDetails.currency.mintAddress,
    paymentDetails.currency.symbol,
    paymentDetails.id,
    paymentDetails.type,
  ]);

  const currencyOptions =
    tokenSwapCurrencies
      ?.filter(
        ({ mintAddress, symbol }) =>
          mintAddress != null && symbol !== paymentDetails?.currency.symbol
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
        tokenSwapQuote?.inAmount
      )} ${selectedCurrency?.symbol}`;
    }

    return currencyLabel;
  };

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
                  ) as unknown as Currency
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
                  1 {paymentDetails.currency.symbol} ={' '}
                  {roundValue(
                    HelioSDK.tokenConversionService.convertFromMinimalUnits(
                      tokenSwapQuote.from.symbol,
                      tokenSwapQuote.inAmount
                    ) /
                      HelioSDK.tokenConversionService.convertFromMinimalUnits(
                        tokenSwapQuote.to.symbol,
                        tokenSwapQuote.outAmount
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
