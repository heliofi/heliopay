import ReactDOM from 'react-dom';
import { useHelioProvider } from '../../providers/helio/HelioContext';
import HelioIcon from '../icons/HelioIcon';
import { Form, Formik } from 'formik';
import { Modal, InheritedModalProps } from '../modal';
import validationSchema from '../heliopay-container/validation-schema';
import { useEffect, useState } from 'react';
import { TokenConversionService } from '../../domain/services/TokenConversionService';
import Input from '../input';
import Button from '../button';
import { StyledFormText, StyledFormTitle, StyledPrice } from './styles';
import SelectBox from '../selectbox';
import { countries } from '../../domain/constants/countries';
import { removeUndefinedFields } from '../../utils';
import OneTimePaymentButton from '../one-time-payment-button';
import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../domain';

interface Props extends InheritedModalProps {
  onStartPayment: () => void;
  onSuccess: (event: SuccessPaymentEvent) => void;
  paymentRequestId: string;
  onError: (event: ErrorPaymentEvent) => void;
  onPending: (event: PendingPaymentEvent) => void;
}

const CustomerDetailsFormModal = ({
  onHide,
  paymentRequestId,
  onStartPayment,
  onSuccess,
  onError,
  onPending,
}: Props) => {
  const { currencyList, paymentDetails } = useHelioProvider();
  const [actualPrice, setActualPrice] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [currency, setCurrency] = useState<{
    id: string;
    symbol?: string | null;
    name?: string | null;
    mintAddress?: string | null;
    decimals?: number | null;
    coinMarketCapId?: number | null;
    type: string;
    sign?: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
  } | null>(null);

  const [customerDetails, setCustomerDetails] = useState<{
    fullName?: string;
    email?: string;
    discordUsername?: string;
    twitterUsername?: string;
    country?: string;
    deliveryAddress?: string;
  }>({
    fullName: undefined,
    email: undefined,
    discordUsername: undefined,
    twitterUsername: undefined,
    country: undefined,
    deliveryAddress: undefined,
  });

  const countryOptions = countries.map((country) => ({
    label: country.name,
    value: country.code,
  }));

  const getCurrency = (currency?: string) => {
    if (!currency) return;
    return currencyList.find((c: any) => c.symbol === currency);
  };

  useEffect(() => {
    setCurrency(getCurrency(paymentDetails.currency));
  }, [paymentDetails?.currency]);

  useEffect(() => {
    if (
      paymentDetails?.currency != null &&
      paymentDetails?.normalizedPrice != null
    ) {
      setActualPrice(
        TokenConversionService.convertFromMinimalUnits(
          getCurrency(paymentDetails.currency),
          paymentDetails.normalizedPrice
        )
      );
    }
  }, [paymentDetails]);

  return ReactDOM.createPortal(
    <div>
      <Modal
        onHide={onHide}
        icon={<HelioIcon />}
        title={`Pay with ${currency?.symbol}`}
      >
        {paymentDetails ? (
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              requireEmail: paymentDetails.requireEmail,
              requireDiscordUsername: paymentDetails.requireDiscordUsername,
              requireFullName: paymentDetails.requireFullName,
              requireTwitterUsername: paymentDetails.requireTwitterUsername,
              requireCountry: paymentDetails.requireCountry,
              requireDeliveryAddress: paymentDetails.requireDeliveryAddress,
              canChangePrice: paymentDetails.canChangePrice,
              canChangeQuantity: paymentDetails.canChangeQuantity,
              fullName: undefined,
              email: undefined,
              discordUsername: undefined,
              twitterUsername: undefined,
              country: undefined,
              deliveryAddress: undefined,
              quantity: paymentDetails.canChangeQuantity ? 1 : undefined,
              customPrice: paymentDetails.canChangePrice ? undefined : 0,
            }}
            onSubmit={(values) => {
              console.log('submit', { values });
              const details = {
                fullName: values.fullName,
                email: values.email,
                discordUsername: values.discordUsername,
                twitterUsername: values.twitterUsername,
                country: values.country,
                deliveryAddress: values.deliveryAddress,
              };

              const clearDetails = removeUndefinedFields(details);

              setCustomerDetails(clearDetails);
              setIsFormSubmitted(true);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div>
                  <StyledPrice>
                    Total price:{' '}
                    <b>
                      {actualPrice} {currency?.symbol}
                    </b>
                  </StyledPrice>
                  <StyledFormTitle>Information required</StyledFormTitle>
                  <StyledFormText>
                    We need some information from you to deliver the product.
                  </StyledFormText>
                  {paymentDetails.requireFullName && (
                    <div className="mb-2">
                      <Input
                        fieldId="fullName"
                        fieldName="fullName"
                        placeholder="Full name"
                        label="Full name"
                      />
                    </div>
                  )}

                  {paymentDetails.requireEmail && (
                    <div className="mb-2">
                      <Input
                        fieldId="email"
                        fieldName="email"
                        placeholder="john@helio.co"
                        label="E-mail address"
                      />
                    </div>
                  )}

                  {paymentDetails.requireTwitterUsername && (
                    <div className="mb-2">
                      <Input
                        fieldId="twitterUsername"
                        fieldName="twitterUsername"
                        placeholder="@helio_pay"
                        label="Twitter username"
                      />
                    </div>
                  )}

                  {paymentDetails.requireDiscordUsername && (
                    <div className="mb-2">
                      <Input
                        fieldId="discordUsername"
                        fieldName="discordUsername"
                        placeholder="HelioFi"
                        label="Discord username"
                      />
                    </div>
                  )}

                  {paymentDetails.requireCountry && (
                    <div className="mb-2">
                      <SelectBox
                        options={countryOptions}
                        placeholder="Select country"
                        value={values.country}
                        showValidations
                        fieldName="country"
                        label="Country"
                        onChange={(option) =>
                          setFieldValue('country', option.label)
                        }
                      />
                    </div>
                  )}

                  {paymentDetails.requireDeliveryAddress && (
                    <div className="mb-2">
                      <Input
                        fieldId="deliveryAddress"
                        fieldName="deliveryAddress"
                        fieldAs="textarea"
                        placeholder="Shipping address"
                        label="Shipping address"
                      />
                    </div>
                  )}
                  <OneTimePaymentButton
                    type="submit"
                    amount={paymentDetails?.normalizedPrice}
                    currency={getCurrency(paymentDetails?.currency)?.symbol}
                    onStartPayment={onStartPayment}
                    onSuccess={onSuccess}
                    receiverSolanaAddress={
                      paymentDetails?.owner?.wallets?.items?.[0]?.publicKey
                    }
                    paymentRequestId={paymentRequestId}
                    onError={onError}
                    onPending={onPending}
                    quantity={1}
                    isFormSubmitted={isFormSubmitted}
                    disabled={!paymentDetails}
                    customerDetails={customerDetails}
                  />
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <h2>Failed to load payment details</h2>
        )}
      </Modal>
    </div>,
    document.body
  );
};

export default CustomerDetailsFormModal;
