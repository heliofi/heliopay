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
};

const PhoneNumberInput = ({
  value,
  onChange,
  placeholder = 'Phone Number',
  label,
  fieldId,
  fieldName,
}: PhoneNumberInputProps) => (
  <StyledWrapper>
    {label && <StyledLabel htmlFor={fieldId}>{label}</StyledLabel>}
    <ElementContainer>
      <PhoneInput onChange={onChange} value={value} placeholder={placeholder} />
    </ElementContainer>
    <StyledErrorMessage name={fieldName} component="div" />
  </StyledWrapper>
);

export default PhoneNumberInput;
