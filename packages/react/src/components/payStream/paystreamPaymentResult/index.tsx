import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
  CreatePaystreamResponse,
  ErrorPaymentEvent,
  SuccessPaymentEvent,
  PendingPaymentEvent,
} from '@heliofi/sdk';
import { Currency, IntervalType, Paystream } from '@heliofi/common';
import { CreatePaymentService } from '@heliofi/sdk/dist/src/domain/services/CreatePaymentService';
import {
  SECOND_MS,
  StringService,
  TimeFormatterService,
} from '@heliofi/sdk/dist/src/domain';

import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';

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
  StyledSwapWrapper,
  StyledPPResultButtonText,
} from './styles';
import Alarm from '../../../assets/icons/Alarm';
import { Stop } from '../../../assets/icons/Stop';
import PaymentResult from '../../paymentResult';
import { timeUnitLabels } from '../time-units';
import { useHelioProvider } from '../../../providers/helio/HelioContext';
import { ExplorerLink } from '../../../ui-kits';
import { useAnchorProvider } from '../../../providers/anchor/AnchorContext';
import { useCompositionRoot } from '../../../hooks/compositionRoot';

interface Props {
  result: {
    errorMessage?: string;
  } & (SuccessPaymentEvent<CreatePaystreamResponse> | ErrorPaymentEvent);
  totalAmount?: number;
  setShowLoadingModal: (showLoadingModal: boolean) => void;
  currency: Currency;
  onError: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
}

const PaystreamPaymentResult = ({
  result,
  totalAmount,
  setShowLoadingModal,
  onError,
  onPending,
  currency,
}: Props) => {
  const wallet = useAnchorWallet();
  const helioProvider = useAnchorProvider();
  const connectionProvider = useConnection();
  const { getPaymentDetails } = useHelioProvider();
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
  const transactionSignature =
    'data' in result ? result.data.transactionSignature : undefined;

  const hasError = 'errorMessage' in result;

  const cancelPayment = useCallback(async () => {
    setShowLoadingModal(true);
    if (helioProvider && wallet && connectionProvider && paymentId) {
      await HelioSDK.paystreamCancelService.handleTransaction({
        anchorProvider: helioProvider,
        symbol: currency?.symbol,
        paymentId,
        onSuccess: () => {
          window.location.reload();
        },
        onError,
        onPending: (event: PendingPaymentEvent) => onPending?.(event),
        wallet,
        connection: connectionProvider.connection,
        cluster: HelioSDK.configService.getCluster(),
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
                <StyledSwapWrapper>
                  Swap transaction
                  <StyledPPResultLink>
                    <ExplorerLink transaction={transactionSignature} />
                  </StyledPPResultLink>
                </StyledSwapWrapper>
              )}
            </StyledPPResultInfo>

            <StyledPPResultAmount>
              Pay per {timeUnit}:{' '}
              <StyledPPResultPrice>
                {totalAmount || paymentDetails.normalizedPrice}{' '}
                {paymentDetails.currency.symbol} / {timeUnit}
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
