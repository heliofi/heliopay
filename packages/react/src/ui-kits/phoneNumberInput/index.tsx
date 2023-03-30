import React from 'react';
import PhoneInput from 'react-phone-number-input';

import ElementContainer from '../elementContainer';

import { StyledErrorMessage, StyledLabel, StyledWrapper } from './styles';

type PhoneNumberInputProps = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  fieldId: string;
  fieldName: string;
  required?: boolean;
};

const PhoneNumberInput = ({
  value,
  onChange,
  placeholder = 'Phone Number',
  label,
  fieldId,
  fieldName,
  required,
}: PhoneNumberInputProps) => (
  <StyledWrapper>
    {label && (
      <StyledLabel htmlFor={fieldId} required={!!required}>
        {label}
      </StyledLabel>
    )}
    <ElementContainer>
      <PhoneInput onChange={onChange} value={value} placeholder={placeholder} />
    </ElementContainer>
    <StyledErrorMessage name={fieldName} component="div" />
  </StyledWrapper>
);

export default PhoneNumberInput;
