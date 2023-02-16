import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Form, Formik } from 'formik';
import { Currency } from '@heliofi/common';
import { CheckoutHeader } from '../checkoutHeader';
import CustomerInfo from '../customerInfo';
import {
  StyledBaseCheckoutWrapper,
  StyledBaseCheckoutContainer,
  StyledBaseCheckoutBody,
} from './styles';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import {
  formatTotalPrice,
  getCurrency,
  getInitialValues,
  handleSubmit,
} from './actions';
import { InheritedBaseCheckoutProps } from './constants';
import validationSchema from './validation-schema';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import {
  CurrencyIcon,
  Button,
  QRButton,
  PriceBanner,
  PhantomCompatibleCard,
  QRCodeCard,
} from '../../ui-kits';
import SwapsForm from '../swapsForm';

type BaseCheckoutProps = InheritedBaseCheckoutProps & {
  PricingComponent: FC<any>;
};

const BaseCheckout = ({
  onHide,
  onSubmit,
  allowedCurrencies,
  totalAmount,
  PricingComponent,
}: BaseCheckoutProps) => {
  const {
    currencyList,
    paymentDetails,
    tokenSwapLoading,
    tokenSwapQuote,
    tokenSwapError,
    removeTokenSwapError,
  } = useHelioProvider();

  const { HelioSDK } = useCompositionRoot();

  const [normalizedPrice, setNormalizedPrice] = useState(0);
  const [activeCurrency, setActiveCurrency] = useState<Currency | null>(null);
  const [showSwapMenu, setShowSwapMenu] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const canSelectCurrency = allowedCurrencies.length > 1;

  const payButtonText =
    showSwapMenu && tokenSwapQuote?.from?.symbol && !tokenSwapError
      ? `PAY IN ${tokenSwapQuote.from.symbol}`
      : 'PAY';
  const payButtonDisable =
    (showSwapMenu && !!tokenSwapError) || tokenSwapLoading;

  const initialValues = getInitialValues(
    paymentDetails,
    normalizedPrice,
    canSelectCurrency,
    paymentDetails?.dynamic
      ? allowedCurrencies?.[0].symbol
      : paymentDetails?.currency?.symbol
  );

  useEffect(() => {
    if (allowedCurrencies.length === 1) {
      setActiveCurrency(allowedCurrencies[0]);
    } else if (!canSelectCurrency) {
      setActiveCurrency(
        getCurrency(currencyList, paymentDetails?.currency?.symbol)
      );
    }
  }, [paymentDetails?.currency, canSelectCurrency]);

  useEffect(() => {
    if (
      paymentDetails?.currency != null &&
      paymentDetails?.normalizedPrice != null
    ) {
      setNormalizedPrice(
        HelioSDK.tokenConversionService.convertFromMinimalUnits(
          paymentDetails?.currency?.symbol,
          paymentDetails?.normalizedPrice
        )
      );
    }
  }, [paymentDetails]);

  useEffect(() => {
    if (!showSwapMenu) {
      removeTokenSwapError();
    }
  }, [showSwapMenu]);

  return createPortal(
    <StyledBaseCheckoutWrapper>
      <StyledBaseCheckoutContainer>
        <CheckoutHeader
          icon={
            activeCurrency && (
              <CurrencyIcon gradient iconName={activeCurrency?.symbol || ''} />
            )
          }
          title={activeCurrency ? `Pay with ${activeCurrency?.symbol}` : 'Pay'}
          showSwap={paymentDetails?.features.canSwapTokens}
          isSwapShown={showSwapMenu}
          toggleSwap={() => setShowSwapMenu(!showSwapMenu)}
          onHide={onHide}
          showQRCode={showQRCode}
        />

        <StyledBaseCheckoutBody>
          {showQRCode && (
            <div>
              {!paymentDetails?.features.canChangePrice && (
                <PriceBanner
                  title="Total price:"
                  amount={formatTotalPrice(totalAmount || normalizedPrice)}
                  currency={activeCurrency?.symbol}
                />
              )}
              <QRCodeCard
                phantomDeepLink={`https://phantom.app/ul/browse/${HelioSDK.configService.getPaymentFullLink(
                  paymentDetails?.id
                )}`}
              />
              <PhantomCompatibleCard />
            </div>
          )}
          {!showQRCode &&
            (paymentDetails ? (
              <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit({
                  paymentDetails,
                  HelioSDK,
                  price: totalAmount || normalizedPrice,
                  onSubmit,
                  currencyList,
                })}
                validationSchema={validationSchema}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <PricingComponent
                      formValues={values}
                      setFieldValue={setFieldValue}
                      activeCurrency={activeCurrency}
                      price={totalAmount || normalizedPrice}
                      canSelectCurrency={canSelectCurrency}
                      allowedCurrencies={allowedCurrencies}
                      setActiveCurrency={setActiveCurrency}
                    />

                    {showSwapMenu && (
                      <SwapsForm
                        formValues={values}
                        setFieldValue={setFieldValue}
                        normalizedPrice={
                          ((normalizedPrice || totalAmount) ?? 0) *
                          (values.quantity ?? 1)
                        }
                      />
                    )}

                    <CustomerInfo
                      formValues={values}
                      setFieldValue={setFieldValue}
                    />

                    <Button type="submit" disabled={payButtonDisable}>
                      {payButtonText}
                    </Button>
                  </Form>
                )}
              </Formik>
            ) : (
              <h2>Failed to load payment details.</h2>
            ))}

          <QRButton showQRCode={showQRCode} setShowQRCode={setShowQRCode} />
        </StyledBaseCheckoutBody>
      </StyledBaseCheckoutContainer>
    </StyledBaseCheckoutWrapper>,
    document.body
  );
};

export default BaseCheckout;
