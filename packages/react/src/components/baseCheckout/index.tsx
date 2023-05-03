import React, { FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Form, Formik, FormikValues } from 'formik';
import {
  BlockchainSymbol,
  Currency,
  IntervalType,
  LinkFeaturesDto,
  PaymentRequestType,
} from '@heliofi/common';

import { DAY, HOUR, MINUTE, MONTH, WEEK } from '@heliofi/sdk/dist/src';
import { useAccount } from 'wagmi';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  formatTotalPrice,
  getCurrency,
  getInitialValues,
  handleSubmit,
} from './actions';
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
  StyledBaseCheckoutContainer,
  StyledBaseCheckoutWrapper,
} from './styles';
import { CheckoutSearchParamsManager } from '../../domain/services/CheckoutSearchParamsManager';
import { useCheckoutSearchParamsProvider } from '../../providers/checkoutSearchParams/CheckoutSearchParamsContext';

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
    getPaymentFeatures,
    getPaymentDetails,
    tokenSwapLoading,
    tokenSwapQuote,
    tokenSwapError,
    removeTokenSwapError,
    paymentType,
  } = useHelioProvider();
  const { customerDetails } = useCheckoutSearchParamsProvider();
  const { HelioSDK } = useCompositionRoot();

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [decimalAmount, setDecimalAmount] = useState<number>(0);
  const [activeCurrency, setActiveCurrency] = useState<Currency | null>(null);
  const [showSwapMenu, setShowSwapMenu] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const canSelectCurrency = allowedCurrencies.length > 1;
  const canSwapTokens = !!getPaymentFeatures().canSwapTokens;

  const payButtonText =
    showSwapMenu && tokenSwapQuote?.from?.symbol && !tokenSwapError
      ? `PAY IN ${tokenSwapQuote.from.symbol}`
      : 'PAY';
  const payButtonDisable =
    (showSwapMenu && !!tokenSwapError) || tokenSwapLoading;

  const paymentDetails = getPaymentDetails();

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
    paymentDetails?.dynamic
      ? allowedCurrencies?.[0].symbol
      : paymentDetails?.currency?.symbol,
    getPaymentFeatures(),
    getPaymentFeatures<LinkFeaturesDto>().canChangeQuantity,
    getPaymentFeatures<LinkFeaturesDto>().canChangePrice,
    searchParams
  );

  // @todo-v swapCurrency
  const isBalanceEnough = (customPrice?: number, quantity?: number): boolean =>
    HelioSDK.availableBalanceService.isBalanceEnough({
      quantity,
      decimalAmount:
        customPrice ||
        HelioSDK.tokenConversionService.convertFromMinimalUnits(
          paymentDetails?.currency.symbol,
          paymentDetails?.normalizedPrice,
          paymentDetails?.currency?.blockchain?.symbol
        ),
      isTokenSwapped: !!(canSwapTokens && 'SOL'),
    });

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
      setDecimalAmount(
        HelioSDK.tokenConversionService.convertFromMinimalUnits(
          paymentDetails?.currency?.symbol,
          paymentDetails?.normalizedPrice,
          paymentDetails?.currency?.blockchain?.symbol
        )
      );
    }
  }, [
    paymentDetails?.currency,
    paymentDetails?.normalizedPrice,
    paymentDetails?.currency?.blockchain?.symbol,
  ]);

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
            (paymentDetails && paymentType ? (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit({
                  paymentDetails,
                  HelioSDK,
                  totalDecimalAmount: totalAmount || decimalAmount,
                  onSubmit,
                  currencyList,
                  paymentType,
                })}
                validationSchema={validationSchema}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <PricingComponent
                      formValues={values}
                      setFieldValue={setFieldValue}
                      activeCurrency={activeCurrency}
                      totalDecimalAmount={totalAmount || decimalAmount}
                      canSelectCurrency={canSelectCurrency}
                      allowedCurrencies={allowedCurrencies}
                      setActiveCurrency={setActiveCurrency}
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

          <QRButton showQRCode={showQRCode} setShowQRCode={setShowQRCode} />
        </StyledBaseCheckoutBody>
      </StyledBaseCheckoutContainer>
    </StyledBaseCheckoutWrapper>,
    document.body
  );
};

export default BaseCheckout;
