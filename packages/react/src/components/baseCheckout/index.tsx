import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Form, Formik, FormikValues } from 'formik';
import { LinkFeaturesDto, PaymentRequestType } from '@heliofi/common';

import { formatTotalPrice, getInitialValues, handleSubmit } from './actions';
import {
  ButtonWithTooltip,
  CurrencyIcon,
  PhantomCompatibleCard,
  PriceBanner,
  QRButton,
  QRCodeCard,
} from '../../ui-kits';
import SwapsForm from '../swapsForm';
import CustomerInfo from '../customerInfo';
import { CheckoutHeader } from '../checkoutHeader';
import validationSchema from './validation-schema';
import { InheritedBaseCheckoutProps } from './constants';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import { useHelioProvider } from '../../providers/helio/HelioContext';

import { PaylinkPricingProps } from '../payLink/paylinkPricing';
import { PaystreamPricingProps } from '../payStream/paystreamPricing';

import {
  StyledBaseCheckoutBody,
  StyledBaseCheckoutBodyFooter,
  StyledBaseCheckoutContainer,
  StyledBaseCheckoutWrapper,
} from './styles';
import { CheckoutSearchParamsManager } from '../../domain/services/CheckoutSearchParamsManager';
import { useCheckoutSearchParamsProvider } from '../../providers/checkoutSearchParams/CheckoutSearchParamsContext';
import { NetworkIndicator } from '../../ui-kits/networkIndicator';

type BaseCheckoutProps = InheritedBaseCheckoutProps & {
  PricingComponent: FC<PaylinkPricingProps & PaystreamPricingProps>;
};

const BaseCheckout = ({
  onHide,
  onSubmit,
  supportedAllowedCurrencies,
  totalAmount,
  PricingComponent,
}: BaseCheckoutProps) => {
  const {
    currencyList,
    getPaymentFeatures,
    getPaymentDetails,
    tokenSwapLoading,
    tokenSwapQuote,
    tokenSwapError,
    removeTokenSwapError,
    paymentType,
    activeCurrency,
  } = useHelioProvider();
  const { customerDetails } = useCheckoutSearchParamsProvider();
  const { HelioSDK } = useCompositionRoot();

  const [decimalAmount, setDecimalAmount] = useState<number>(0);
  const [showSwapMenu, setShowSwapMenu] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const canSelectCurrency = supportedAllowedCurrencies.length > 1;
  const canSwapTokens = !!getPaymentFeatures().canSwapTokens;

  const payButtonText =
    showSwapMenu && tokenSwapQuote?.from?.symbol && !tokenSwapError
      ? `PAY IN ${tokenSwapQuote.from.symbol}`
      : 'PAY';
  const payButtonDisable =
    (showSwapMenu && !!tokenSwapError) || tokenSwapLoading;

  const paymentDetails = getPaymentDetails();

  const blockchain = paymentDetails?.currency?.blockchain?.symbol;

  const getSwapsFormPrice = (formValues: FormikValues) => {
    const amount = (decimalAmount || totalAmount) ?? 0;
    return paymentType === PaymentRequestType.PAYLINK
      ? amount * (formValues.quantity ?? 1)
      : amount * (formValues.interval ?? 1);
  };
  const searchParams =
    CheckoutSearchParamsManager.getFilteredCheckoutSearchParams(
      getPaymentFeatures(),
      customerDetails
    );

  const initialValues = getInitialValues(
    totalAmount || decimalAmount,
    canSelectCurrency,
    getPaymentDetails,
    activeCurrency?.symbol,
    getPaymentFeatures(),
    getPaymentFeatures<LinkFeaturesDto>().canChangeQuantity,
    getPaymentFeatures<LinkFeaturesDto>().canChangePrice,
    searchParams
  );

  // @todo-v swapCurrency
  const isBalanceEnough = (
    customPrice?: number,
    quantity?: number
  ): boolean => {
    if (!activeCurrency?.symbol) {
      return true;
    }
    return HelioSDK.availableBalanceService.isBalanceEnough({
      quantity,
      decimalAmount:
        customPrice ||
        HelioSDK.tokenConversionService.convertFromMinimalUnits(
          activeCurrency.symbol,
          paymentDetails?.normalizedPrice,
          blockchain
        ),
      isTokenSwapped: !!(canSwapTokens && 'SOL'),
    });
  };

  useEffect(() => {
    if (
      activeCurrency &&
      paymentDetails?.currency != null &&
      paymentDetails?.normalizedPrice != null
    ) {
      setDecimalAmount(
        HelioSDK.tokenConversionService.convertFromMinimalUnits(
          activeCurrency.symbol,
          paymentDetails?.normalizedPrice,
          paymentDetails?.currency?.blockchain?.symbol
        )
      );
    }
  }, [activeCurrency, paymentDetails]);

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
          showSwap={canSwapTokens}
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
                  totalDecimalAmount={formatTotalPrice(
                    totalAmount || decimalAmount
                  )}
                  currency={activeCurrency?.symbol}
                />
              )}
              {paymentDetails?.id && paymentType && (
                <QRCodeCard
                  phantomDeepLink={`${HelioSDK.configService.getPhantomLink(
                    paymentDetails?.id,
                    paymentType
                  )}`}
                />
              )}
              <PhantomCompatibleCard />
            </div>
          )}
          {!showQRCode &&
            (paymentDetails && paymentType && activeCurrency ? (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit({
                  paymentDetails,
                  HelioSDK,
                  totalDecimalAmount: totalAmount || decimalAmount,
                  onSubmit,
                  currency: activeCurrency,
                  paymentType,
                })}
                validationSchema={validationSchema}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <PricingComponent
                      formValues={values}
                      setFieldValue={setFieldValue}
                      totalDecimalAmount={totalAmount || decimalAmount}
                      canSelectCurrency={canSelectCurrency}
                      supportedAllowedCurrencies={supportedAllowedCurrencies}
                    />
                    {showSwapMenu && (
                      <SwapsForm
                        formValues={values}
                        setFieldValue={setFieldValue}
                        totalDecimalAmount={getSwapsFormPrice(values)}
                      />
                    )}
                    <CustomerInfo
                      formValues={values}
                      setFieldValue={setFieldValue}
                    />
                    <ButtonWithTooltip
                      type="submit"
                      disabled={
                        payButtonDisable ||
                        !isBalanceEnough(values.customPrice, values.quantity)
                      }
                      showTooltip={
                        !isBalanceEnough(values.customPrice, values.quantity)
                      }
                      tooltipText="Not enough funds in your wallet"
                    >
                      {payButtonText}
                    </ButtonWithTooltip>
                  </Form>
                )}
              </Formik>
            ) : (
              <h2>Failed to load payment details.</h2>
            ))}

          <StyledBaseCheckoutBodyFooter>
            {blockchain && <NetworkIndicator blockchain={blockchain} />}
            <QRButton showQRCode={showQRCode} setShowQRCode={setShowQRCode} />
          </StyledBaseCheckoutBodyFooter>
        </StyledBaseCheckoutBody>
      </StyledBaseCheckoutContainer>
    </StyledBaseCheckoutWrapper>,
    document.body
  );
};

export default BaseCheckout;
