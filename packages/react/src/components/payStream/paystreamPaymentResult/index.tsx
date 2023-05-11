import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
  CreatePaystreamResponse,
  ErrorPaymentEvent,
  SuccessPaymentEvent,
  PendingPaymentEvent,
  SECOND_MS,
  StringService,
  TimeFormatterService,
  CreatePaymentService,
  getTransactionSignature,
  LoadingModalStep,
} from '@heliofi/sdk';
import { Currency, IntervalType, Paystream } from '@heliofi/common';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { timeUnitLabels } from '../time-units';
import { ExplorerLink } from '../../../ui-kits';
import Alarm from '../../../assets/icons/Alarm';
import PaymentResult from '../../paymentResult';
import { Stop } from '../../../assets/icons/Stop';
import { useCompositionRoot } from '../../../hooks/compositionRoot';
import { useHelioProvider } from '../../../providers/helio/HelioContext';
import { useAnchorProvider } from '../../../providers/anchor/AnchorContext';

import {
  StyledPPResultWrapper,
  StyledPPResultBox,
  StyledPPResultContainer,
  StyledPPResultTime,
  StyledPPResultLiveTime,
  StyledPPResultMaxTime,
  StyledPPResultInfo,
  StyledPPResultStreamInfo,
  StyledPPResultAmount,
  StyledPPResultPrice,
  StyledPPResultButton,
  StyledResultFooter,
  StyledResultFooterText,
  StyledPPResultLink,
  StyledPPResultTopLine,
  StyledPPResultButtonText,
} from './styles';

interface Props {
  result: {
    errorMessage?: string;
  } & (SuccessPaymentEvent<CreatePaystreamResponse> | ErrorPaymentEvent);
  setShowLoadingModal: (showLoadingModal: LoadingModalStep) => void;
  currency: Currency;
  onError: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
}

const PaystreamPaymentResult = ({
  result,
  setShowLoadingModal,
  onError,
  onPending,
  currency,
}: Props) => {
  const wallet = useAnchorWallet();
  const helioProvider = useAnchorProvider();
  const connectionProvider = useConnection();
  const { getPaymentDetails, activeCurrency } = useHelioProvider();
  const { HelioSDK } = useCompositionRoot();

  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState<number>();
  const [extendedTime, setExtendedTime] = useState<string>();
  const [maxTime, setMaxTime] = useState(0);

  const paymentDetails = getPaymentDetails<Paystream>();
  const unit = paymentDetails.interval as IntervalType;
  const timeUnit = timeUnitLabels[unit];
  const paymentData = 'data' in result ? result.data.document : undefined;

  const paymentId = paymentData?.id;
  const startedAt = paymentData?.startedAt;
  const endedAt = paymentData?.endedAt;
  const transactionSignature = getTransactionSignature(
    result?.transaction ?? ''
  );

  const hasError = 'errorMessage' in result;

  const decimalAmount = HelioSDK.tokenConversionService.convertFromMinimalUnits(
    activeCurrency?.symbol ?? '',
    paymentDetails?.normalizedPrice
  );

  const cancelPayment = useCallback(async () => {
    setShowLoadingModal(LoadingModalStep.DEFAULT);
    if (helioProvider && wallet && connectionProvider && paymentId) {
      await HelioSDK.paystreamCancelService.handleTransaction({
        anchorProvider: helioProvider,
        symbol: currency?.symbol,
        paymentId,
        onSuccess: () => {
          toast.success('Your Pay Stream was successfully stopped', {
            duration: 2000,
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        onError,
        onPending: (event: PendingPaymentEvent) => onPending?.(event),
        wallet,
        connection: connectionProvider.connection,
        cluster: HelioSDK.configService.getCluster(), // @todo-v delete don't use
      });
    }
  }, [
    currency,
    helioProvider,
    onError,
    onPending,
    paymentId,
    wallet,
    connectionProvider,
  ]);

  useEffect(() => {
    if (endedAt && startedAt) {
      const maximumTime = CreatePaymentService.secondsToTime(
        unit,
        Number(endedAt - startedAt)
      );
      setMaxTime(Math.round(maximumTime));
    }
  }, [endedAt, startedAt, unit]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (endedAt) {
        const timeRemaining = TimeFormatterService.secondsRemaining(
          Number(endedAt)
        );

        setTime(timeRemaining);
        setExtendedTime(
          CreatePaymentService.secondsToHumanReadable(timeRemaining)
        );
      }
      setLoading(false);
    }, SECOND_MS);
    return () => clearInterval(interval);
  }, [endedAt]);

  return (
    <StyledPPResultWrapper>
      {hasError ? (
        <PaymentResult result={result} />
      ) : (
        <StyledPPResultBox>
          <StyledPPResultTopLine>
            <Alarm />
          </StyledPPResultTopLine>

          <StyledPPResultContainer>
            <StyledPPResultTime>
              <StyledPPResultLiveTime title={extendedTime}>
                {loading && 'Loading...'}
                {!loading &&
                  (time !== undefined && time > 0
                    ? `${Math.ceil(
                        CreatePaymentService.secondsToTime(unit, time)
                      )} ${StringService.toPlural(Math.ceil(time), timeUnit)}`
                    : 'Expired')}
              </StyledPPResultLiveTime>
              <StyledPPResultMaxTime>
                {maxTime} {StringService.toPlural(maxTime, timeUnit)} max
              </StyledPPResultMaxTime>
            </StyledPPResultTime>

            <StyledPPResultInfo>
              <StyledPPResultStreamInfo>
                Stream started!
              </StyledPPResultStreamInfo>
              <p>Transaction approved</p>
              <StyledPPResultLink>
                <ExplorerLink transaction={transactionSignature} />
              </StyledPPResultLink>
              {result.swapTransactionSignature && (
                <StyledPPResultLink>
                  <ExplorerLink
                    transaction={result.swapTransactionSignature}
                    title="View swapped transaction"
                  />
                </StyledPPResultLink>
              )}
            </StyledPPResultInfo>

            <StyledPPResultAmount>
              Pay per {timeUnit}:{' '}
              <StyledPPResultPrice>
                {decimalAmount} {activeCurrency?.symbol} / {timeUnit}
              </StyledPPResultPrice>
            </StyledPPResultAmount>

            <StyledPPResultButton disabled={!time} onClick={cancelPayment}>
              <StyledPPResultButtonText>
                <Stop />
                STOP PAY STREAM
                <span />
              </StyledPPResultButtonText>
            </StyledPPResultButton>
          </StyledPPResultContainer>
        </StyledPPResultBox>
      )}
      {!hasError && (
        <StyledResultFooter>
          <StyledResultFooterText>
            Need help?{' '}
            <a href="https://www.hel.io/" target="_blank" rel="noreferrer">
              Contact Helio
            </a>
          </StyledResultFooterText>
        </StyledResultFooter>
      )}
    </StyledPPResultWrapper>
  );
};

export default PaystreamPaymentResult;
