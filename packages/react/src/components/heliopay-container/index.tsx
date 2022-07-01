import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect } from 'react';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import { HelioApiAdapter } from '../../infrastructure/helio-api/HelioApiAdapter';
import ConnectButton from '../connect-button';
import OneTimePaymentButton, {
  OneTimePaymentProps,
} from '../one-time-payment-button';
import { TokenConversionService } from '../../domain/services/TokenConversionService';

interface HeliopayContainerProps extends OneTimePaymentProps {
  buttonType: OneTimePaymentProps['type'];
}

export const HelioPayContainer: FC<HeliopayContainerProps> = ({
  amount,
  currency,
  onStartPayment,
  onSuccess,
  receiverSolanaAddress,
  paymentRequestId,
  onError,
  onPending,
  isFormSubmitted,
  buttonType,
  customerDetails,
  quantity,
}) => {
  const wallet = useAnchorWallet();

  const { currencyList, paymentDetails, getCurrencyList, getPaymentDetails } =
    useHelioProvider();

  useEffect(() => {
    getCurrencyList();
  }, []);

  useEffect(() => {
    getPaymentDetails(paymentRequestId);
  }, [paymentRequestId]);

  const getCurrency = (currency?: string) => {
    if (!currency) return;
    return currencyList.find((c: any) => c.symbol === currency);
  };

  return (
    <div>
      <ConnectButton />
      {paymentDetails && (
        <>
          <h2>currency: {getCurrency(paymentDetails.currency)?.name}</h2>
          <h2>product name: {paymentDetails.name}</h2>
          <h2>
            product amount:{' '}
            {TokenConversionService.convertFromMinimalUnits(
              getCurrency(paymentDetails.currency),
              paymentDetails.normalizedPrice
            )}
          </h2>
        </>
      )}
      <br />
      <OneTimePaymentButton
        amount={paymentDetails.normalizedPrice}
        currency={getCurrency(paymentDetails.currency)?.symbol}
        onStartPayment={onStartPayment}
        onSuccess={onSuccess}
        receiverSolanaAddress={receiverSolanaAddress}
        paymentRequestId={paymentRequestId}
        onError={onError}
        onPending={onPending}
        isFormSubmitted={isFormSubmitted}
        type={buttonType}
        customerDetails={customerDetails}
        quantity={quantity}
      />
      {/* {wallet ? (
        <div>
          <OneTimePaymentButton
            amount={amount}
            currency={currency}
            onStartPayment={onStartPayment}
            onSuccess={onSuccess}
            receiverSolanaAddress={receiverSolanaAddress}
            paymentRequestId={paymentRequestId}
            onError={onError}
            onPending={onPending}
            isFormSubmitted={isFormSubmitted}
            type={buttonType}
            customerDetails={customerDetails}
            quantity={quantity}
          />
        </div>
      ) : (
        <ConnectButton />
      )} */}
    </div>
  );
};

export default HelioPayContainer;
