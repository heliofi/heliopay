import PhoneInput from 'react-phone-number-input';

import 'react-phone-number-input/style.css';
import InputContainer from '../input-container';
import { StyledErrorMessage, StyledLabel, StyledWrapper } from './styles';

type PhoneNumberInputProps = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  fieldId: string;
  fieldName: string;
};

const defaultFieldPlaceholder = 'Phone Number';

const PhoneNumberInput = ({
  value,
  onChange,
  placeholder = defaultFieldPlaceholder,
  label,
  fieldId,
  fieldName,
}: PhoneNumberInputProps) => (
  <StyledWrapper>
    {label && <StyledLabel htmlFor={fieldId}>{label}</StyledLabel>}
    <InputContainer>
      <PhoneInput onChange={onChange} value={value} placeholder={placeholder} />
    </InputContainer>
    <StyledErrorMessage name={fieldName} component="div" />
  </StyledWrapper>
);

export default PhoneNumberInput;
