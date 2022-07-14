import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import ConnectButton from '../connect-button';
import {
  ClusterType,
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../domain';
import Button from '../button';
import WalletController from '../WalletController';
import {
  StyledEnvironment,
  StyledErrorMessage,
  StyledLeft,
  StyledLogo,
  StyledLogoContainer,
  StyledRight,
  StyledRow,
  StyledWrapper,
} from './styles';
import HelioLogoGray from '../icons/HelioLogoGray';
import CustomerDetailsFormModal from '../customer-details-form-modal';
import { LoadingModal } from '../loading-modal';
import { useAnchorProvider } from '../../providers/anchor/AnchorContext';
import { createOneTimePayment } from '../../infrastructure';
import PaymentResult from '../payment-result';
import { Cluster } from '@solana/web3.js';

interface HeliopayContainerProps {
  paymentRequestId: string;
  onSuccess: (event: SuccessPaymentEvent) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
  onStartPayment: () => void;
  cluster: Cluster;
  payButtonTitle?: string;
}

export const HelioPayContainer: FC<HeliopayContainerProps> = ({
  onStartPayment,
  onSuccess,
  paymentRequestId,
  onError,
  onPending,
  cluster,
  payButtonTitle = 'Pay',
}) => {
  const wallet = useAnchorWallet();
  const helioProvider = useAnchorProvider();

  const [result, setResult] = useState<
    SuccessPaymentEvent | ErrorPaymentEvent | null
  >(null);

  const {
    currencyList,
    paymentDetails,
    getCurrencyList,
    getPaymentDetails,
    initCluster,
    cluster: mainCluster,
  } = useHelioProvider();

  const [showFormModal, setShowFormModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  useEffect(() => {
    initCluster(cluster);
  }, [cluster]);

  useEffect(() => {
    getCurrencyList();
  }, []);

  useEffect(() => {
    if (mainCluster) {
      getPaymentDetails(paymentRequestId);
    }
  }, [paymentRequestId, mainCluster]);

  const getCurrency = (currency?: string) => {
    if (!currency) return;
    return currencyList.find((c: any) => c.symbol === currency);
  };

  const isCustomerDetailsRequired = (): boolean => {
    if (!paymentDetails) return false;
    return (
      paymentDetails.requireEmail ||
      paymentDetails.requireFullName ||
      paymentDetails.requireDiscordUsername ||
      paymentDetails.requireTwitterUsername ||
      paymentDetails.requireCountry ||
      paymentDetails.requireDeliveryAddress ||
      paymentDetails.canChangeQuantity ||
      paymentDetails.canChangePrice
    );
  };

  const handleSuccessPayment = (event: SuccessPaymentEvent) => {
    onSuccess(event);
    setResult(event);
    setShowLoadingModal(false);
  };

  const handleErrorPayment = (event: ErrorPaymentEvent) => {
    onError(event);
    setResult(event);
    setShowLoadingModal(false);
  };

  const submitPayment = async ({ amount, quantity, customerDetails }: any) => {
    if (helioProvider) {
      onStartPayment?.();
      setShowLoadingModal(true);
      setShowFormModal(false);
      const recipient = paymentDetails?.owner?.wallets?.items?.[0]?.publicKey;
      const payload = {
        anchorProvider: helioProvider,
        recipientPK: recipient,
        symbol: getCurrency(paymentDetails?.currency)?.symbol,
        amount: amount * (quantity || 1),
        paymentRequestId,
        onSuccess: handleSuccessPayment,
        onError: handleErrorPayment,
        onPending,
        customerDetails,
        quantity: Number(quantity) ?? 1,
        cluster: cluster,
      };
      try {
        await createOneTimePayment(payload);
      } catch (error) {
        console.log({ error });
      }
    }
  };

  return (
    <StyledWrapper>
      {!result ? (
        <>
          <StyledRow>
            <StyledLeft>
              {wallet ? (
                <div>
                  <Button
                    onClick={() => {
                      if (isCustomerDetailsRequired()) {
                        setShowFormModal(true);
                      } else {
                        submitPayment({
                          amount: paymentDetails?.normalizedPrice,
                          quantity: 1,
                          customerDetails: undefined,
                        });
                      }
                    }}
                    disabled={!paymentDetails?.id}
                  >
                    {payButtonTitle}
                  </Button>
                </div>
              ) : (
                <>
                  <ConnectButton />
                </>
              )}
            </StyledLeft>
            <StyledRight>
              Powered by
              <StyledLogoContainer>
                <StyledLogo>
                  <HelioLogoGray />
                </StyledLogo>
                {cluster === ClusterType.Devnet && (
                  <StyledEnvironment>DEVNET</StyledEnvironment>
                )}
              </StyledLogoContainer>
            </StyledRight>
          </StyledRow>

          {paymentDetails?.message && (
            <StyledErrorMessage>{paymentDetails.message}</StyledErrorMessage>
          )}
          {wallet && <WalletController />}
        </>
      ) : (
        <PaymentResult result={result} />
      )}
      {showFormModal && (
        <CustomerDetailsFormModal
          onHide={() => setShowFormModal(false)}
          onSubmit={submitPayment}
        />
      )}

      {showLoadingModal && (
        <LoadingModal onHide={() => setShowLoadingModal(false)} />
      )}
    </StyledWrapper>
  );
};

export default HelioPayContainer;
