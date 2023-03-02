import React, { FC, useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import { createPortal } from 'react-dom';
import { Currency, LinkFeaturesDto } from '@heliofi/common';

import {
  formatTotalPrice,
  getCurrency,
  getInitialValues,
  handleSubmit,
} from './actions';
import {
  CurrencyIcon,
  Button,
  QRButton,
  PriceBanner,
  PhantomCompatibleCard,
  QRCodeCard,
} from '../../ui-kits';
import SwapsForm from '../swapsForm';
import CustomerInfo from '../customerInfo';
import { CheckoutHeader } from '../checkoutHeader';
import validationSchema from './validation-schema';
import { InheritedBaseCheckoutProps } from './constants';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import { useHelioProvider } from '../../providers/helio/HelioContext';

import {
  StyledBaseCheckoutWrapper,
  StyledBaseCheckoutContainer,
  StyledBaseCheckoutBody,
} from './styles';
import { PaylinkPricingProps } from '../payLink/paylinkPricing';
import { PaystreamPricingProps } from '../payStream/paystreamPricing';

type BaseCheckoutProps = InheritedBaseCheckoutProps & {
  PricingComponent: FC<PaylinkPricingProps & PaystreamPricingProps>;
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
    getPaymentFeatures,
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
    normalizedPrice,
    canSelectCurrency,
    paymentDetails?.dynamic
      ? allowedCurrencies?.[0].symbol
      : paymentDetails?.currency?.symbol,
    getPaymentFeatures(),
    getPaymentFeatures<LinkFeaturesDto>().canChangeQuantity,
    getPaymentFeatures<LinkFeaturesDto>().canChangePrice
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
  }, [paymentDetails?.currency, paymentDetails?.normalizedPrice]);

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
          showSwap={!!getPaymentFeatures().canSwapTokens}
          isSwapShown={showSwapMenu}
          toggleSwap={() => setShowSwapMenu(!showSwapMenu)}
          onHide={onHide}
          showQRCode={showQRCode}
        />

        <StyledBaseCheckoutBody>
          {showQRCode && (
            <div>
              {!getPaymentFeatures<LinkFeaturesDto>().canChangePrice && (
                <PriceBanner
                  title="Total price:"
                  amount={formatTotalPrice(totalAmount || normalizedPrice)}
                  currency={activeCurrency?.symbol}
                />
              )}
              {paymentDetails?.id && (
                <QRCodeCard
                  phantomDeepLink={`${HelioSDK.configService.getPhantomLink(
                    paymentDetails?.id
                  )}`}
                />
              )}
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
