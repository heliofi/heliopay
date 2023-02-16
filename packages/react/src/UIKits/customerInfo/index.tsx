import React, { FC } from 'react';
import { Input } from '../../UIKits';
import { StyledCurrency, StyledFormText, StyledFormTitle } from './styles';
import CurrencyIcon from '../currencyIcon';
import PhoneNumberInput from '../../UIKits/phoneNumberInput';

type CustomerInfoProps = {
  values: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
};

const CustomerInfo: FC<CustomerInfoProps> = ({ values, setFieldValue }) => {
  console.log('CustomerInfo');
  return (
    <>
      <Input
        fieldId="customPrice"
        fieldName="customPrice"
        label="Name your own price"
        prefix="prefix"
        suffix={
          <StyledCurrency>
            <p>USDC</p>
            <CurrencyIcon gradient iconName="USDC" />
          </StyledCurrency>
        }
      />

      <>
        <StyledFormTitle>Information required</StyledFormTitle>
        <StyledFormText>We need some information from you</StyledFormText>
      </>

      <Input
        fieldId="fullName"
        fieldName="fullName"
        setFieldValue={setFieldValue}
        placeholder="Full name"
        label="Full name"
      />

      <Input
        fieldId="email"
        fieldName="email"
        setFieldValue={setFieldValue}
        placeholder="john@helio.co"
        label="E-mail address"
      />

      <Input
        fieldId="twitterUsername"
        fieldName="twitterUsername"
        setFieldValue={setFieldValue}
        placeholder="@helio_pay"
        label="Twitter username"
      />

      <Input
        fieldId="discordUsername"
        fieldName="discordUsername"
        setFieldValue={setFieldValue}
        placeholder="Helio#1234"
        label="Discord username"
      />

      <PhoneNumberInput
        fieldId="phoneNumber"
        fieldName="phoneNumber"
        label="Phone number"
        onChange={(value) => {
          setFieldValue('phoneNumber', value);
        }}
      />
    </>
  );
};

export default CustomerInfo;
