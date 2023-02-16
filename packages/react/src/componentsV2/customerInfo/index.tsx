import React, { FC, useState } from 'react';
import { ProductInputType } from '@heliofi/common';
import { InfoIcon } from '@heliofi/helio-icons';

import {
  Input,
  PhoneNumberInput,
  SelectBox,
  SelectBoxOption,
} from '../../ui-kits';
import AddressSection from '../addressSection';
import { countries, Country } from '../../domain';
import { FormikProps } from '../baseCheckout/constants';
import { useHelioProvider } from '../../providers/helio/HelioContext';

import {
  StyledFormText,
  StyledFormTitle,
  StyledProductTooltip,
  StyledProductTooltipIcon,
  StyledProductTooltipText,
  StyledProductWrapper,
} from './styles';

type CustomerInfoProps = FormikProps;

const CustomerInfo: FC<CustomerInfoProps> = ({ formValues, setFieldValue }) => {
  const { paymentDetails, isCustomerDetailsRequired } = useHelioProvider();

  const [selectValue, setSelectValue] = useState({
    label: '',
    value: '',
  });
  const [productDetailsDescriptionShown, setProductDetailsDescriptionShown] =
    useState(false);

  const countryOptions = countries.map((countryItem: Country) => ({
    label: countryItem.name,
    value: countryItem.code,
  }));

  const getCountry = (country?: string): string =>
    countryOptions.find((c: any) => c.value === country)?.label as string;

  const stringToOptions = (value: string): SelectBoxOption[] => {
    const options = value.split(',');
    return options.map((option) => ({
      label: option,
      value: option,
    }));
  };

  const changeSelectValue = (
    selectObject: SelectBoxOption,
    setValue: (formikId: string, value: string) => void
  ) => {
    setSelectValue({
      label: selectObject.label,
      value: selectObject.value as string,
    });
    setValue('productValue', selectObject.value as string);
  };

  return (
    <>
      {isCustomerDetailsRequired && (
        <>
          <StyledFormTitle>Information required</StyledFormTitle>
          <StyledFormText>We need some information from you</StyledFormText>
        </>
      )}

      {paymentDetails?.features.requireFullName && (
        <Input
          fieldId="fullName"
          fieldName="fullName"
          setFieldValue={setFieldValue}
          required
          placeholder="Full name"
          label="Full name"
        />
      )}

      {paymentDetails?.features.requireEmail && (
        <Input
          fieldId="email"
          fieldName="email"
          setFieldValue={setFieldValue}
          required
          placeholder="john@helio.co"
          label="E-mail address"
        />
      )}

      {paymentDetails?.features.requireTwitterUsername && (
        <Input
          fieldId="twitterUsername"
          fieldName="twitterUsername"
          setFieldValue={setFieldValue}
          required
          placeholder="@helio_pay"
          label="Twitter username"
        />
      )}

      {paymentDetails?.features.requireDiscordUsername && (
        <Input
          fieldId="discordUsername"
          fieldName="discordUsername"
          setFieldValue={setFieldValue}
          required
          placeholder="Helio#1234"
          label="Discord username"
        />
      )}

      {paymentDetails?.features?.requirePhoneNumber && (
        <PhoneNumberInput
          fieldId="phoneNumber"
          fieldName="phoneNumber"
          required
          label="Phone number"
          onChange={(value) => {
            setFieldValue('phoneNumber', value);
          }}
        />
      )}

      {paymentDetails?.features.requireCountry && (
        <SelectBox
          options={countryOptions}
          placeholder="Select country"
          value={getCountry(formValues?.country)}
          required
          showValidations
          fieldName="country"
          label="Country"
          onChange={(option) => setFieldValue('country', option.value)}
        />
      )}

      {paymentDetails?.features.requireDeliveryAddress && (
        <AddressSection
          values={formValues}
          setFieldValue={setFieldValue}
          areaCodeValue={formValues.areaCode}
          countryCode={formValues.country}
        />
      )}

      {paymentDetails?.features?.requireProductDetails &&
        paymentDetails?.product != null &&
        (paymentDetails?.product?.type === ProductInputType.SELECTOR ? (
          <SelectBox
            value={selectValue.value}
            label={paymentDetails?.product.name}
            required
            placeholder="Select"
            fieldName="productValue"
            onChange={(value) => changeSelectValue(value, setFieldValue)}
            options={stringToOptions(paymentDetails?.product?.description)}
          />
        ) : (
          <StyledProductWrapper>
            <Input
              fieldId="productValue"
              fieldName="productValue"
              setFieldValue={setFieldValue}
              required
              placeholder="Insert data here..."
              label={paymentDetails?.product.name}
              labelSuffix={
                <>
                  {productDetailsDescriptionShown && (
                    <StyledProductTooltip>
                      <StyledProductTooltipText>
                        {paymentDetails?.product.description}
                      </StyledProductTooltipText>
                    </StyledProductTooltip>
                  )}
                  <StyledProductTooltipIcon
                    onMouseLeave={() =>
                      setProductDetailsDescriptionShown(false)
                    }
                    onMouseEnter={() => setProductDetailsDescriptionShown(true)}
                  >
                    <InfoIcon />
                  </StyledProductTooltipIcon>
                </>
              }
            />
          </StyledProductWrapper>
        ))}
    </>
  );
};

export default CustomerInfo;
