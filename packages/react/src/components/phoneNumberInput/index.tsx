import PhoneInput from 'react-phone-number-input';

import 'react-phone-number-input/style.css';
import InputContainer from '../input-container';
import { StyledLabel, StyledWrapper } from './styles';

type PhoneNumberInputProps = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  fieldId: string;
};

const defaultFieldPlaceholder = 'Phone Number';

const PhoneNumberInput = ({
  value,
  onChange,
  placeholder = defaultFieldPlaceholder,
  error,
  label,
  fieldId,
}: PhoneNumberInputProps) => {
  return (
    <StyledWrapper>
      {label && <StyledLabel htmlFor={fieldId}>{label}</StyledLabel>}
      <InputContainer>
        <PhoneInput
          onChange={onChange}
          value={value}
          placeholder={placeholder}
        />
      </InputContainer>
      {error && <div className="text-xs italic text-red-500">{error}</div>}
    </StyledWrapper>
  );
};

export default PhoneNumberInput;
