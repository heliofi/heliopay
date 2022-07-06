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

const CustomerDetailsForm = ({ onHide }: InheritedModalProps) => {
  const { currencyList, paymentDetails } = useHelioProvider();
  const [actualPrice, setActualPrice] = useState(0);
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
    console.log({
      price: TokenConversionService.convertFromMinimalUnits(
        getCurrency(paymentDetails.currency),
        paymentDetails.normalizedPrice
      ),
    });
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
              // const details = {
              //   fullName: values.fullName,
              //   email: values.email,
              //   discordUsername: values.discordUsername,
              //   twitterUsername: values.twitterUsername,
              //   country: values.country,
              //   deliveryAddress: values.deliveryAddress,
              // };

              // const clearDetails = removeUndefinedFields(details);

              // setCustomerDetails(clearDetails);
              // setIsFormSubmitted(true);
            }}
          >
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

                {/* {paymentDetails.requireCountry && (
                  <div className="mb-2">
                    <Label required>Country</Label>
                    <SelectBox
                      options={countryOptions}
                      placeholder="Select country"
                      value={values.country}
                      showValidations
                      fieldName="country"
                      onChange={(option) =>
                        setFieldValue('country', option.label)
                      }
                    />
                  </div>
                )} */}

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
                <Button>PAY</Button>
              </div>
            </Form>
          </Formik>
        ) : (
          <h2>Failed to load payment details</h2>
        )}
      </Modal>
    </div>,
    document.body
  );
};

export default CustomerDetailsForm;
