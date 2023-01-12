import { FormikValues } from 'formik';
import { Currency } from '@heliofi/common';
import { useEffect, useState } from 'react';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import {
  StyledCurrencySelectIcon,
  StyledSpinner,
  StyledSwapError,
  StyledSwapsContainer,
  StyledTokenSwapQuoteInfo,
} from './styles';
import CurrencyIcon from '../currency-icon';
import SelectBox from '../selectbox';
import { CurrencyService } from '../../domain/services/CurrencyService';
import { TokenConversionService } from '../../domain/services/TokenConversionService';
import { useDebounce } from '../../hooks/useDebounce';
import Spinner from '../../assets/placeholders/LoadingSpinner';

interface SwapsFormProps {
  formValues: FormikValues;
  setFieldValue: (field: string, value: unknown) => void;
  normalizedPrice: number;
}

const DEBOUNCE_TIME = 500;

export const SwapsForm = ({
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
  } = useHelioProvider();

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
    if (selectedCurrency?.mintAddress != null) {
      // @TODO check double call
      getTokenSwapQuote(
        paymentDetails.id,
        // @ts-ignore
        'PAYLINK', // @TODO fix
        selectedCurrency.mintAddress,
        formValues.quantity,
        normalizedPrice
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
        label: `${currency.symbol} ${currency.name}`,
        icon: <CurrencyIcon gradient iconName={currency.symbol} />,
      })) || [];

  const getCurrencyLabel = () =>
    // eslint-disable-next-line no-nested-ternary
    tokenSwapQuote != null && selectedCurrency != null && !tokenSwapError
      ? `${TokenConversionService.convertFromMinimalAndRound(
          selectedCurrency?.symbol,
          tokenSwapQuote?.inAmount
        )} ${selectedCurrency?.symbol}`
      : selectedCurrency
      ? `${selectedCurrency?.symbol} (${selectedCurrency?.name})`
      : 'Select currency';

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
                  CurrencyService.getCurrencyBySymbol(
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
                <p>
                  {CurrencyService.roundValue(tokenSwapQuote.priceImpactPct, 3)}
                  %
                </p>
              </StyledTokenSwapQuoteInfo>
              <StyledTokenSwapQuoteInfo>
                <p>Exchange rate:</p>
                <p>
                  1 {paymentDetails.currency.symbol} ={' '}
                  {CurrencyService.roundValue(
                    TokenConversionService.convertFromMinimalUnits(
                      tokenSwapQuote.from.symbol,
                      tokenSwapQuote.inAmount
                    ) /
                      TokenConversionService.convertFromMinimalUnits(
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
