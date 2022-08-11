import { ChangeEvent, FC, useState } from 'react';

import InputContainer, { InputContainerProps } from '../input-container';
import {
  StyledErrorMessage,
  StyledField,
  StyledInput,
  StyledLabel,
} from './styles';

type InputProps = {
  fieldId: string;
  fieldAs?: string;
  fieldName: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  inputClassName?: string;
  label?: string;
};

const Input: FC<InputProps & InputContainerProps> = ({
  placeholder,
  fieldId,
  fieldAs,
  fieldValue,
  fieldName,
  prefix,
  suffix,
  inactive,
  disabled,
  onChange,
  inputClassName = '',
  label,
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <StyledInput>
      {label && <StyledLabel htmlFor={fieldId}>{label}</StyledLabel>}
      <InputContainer
        placeholder={placeholder}
        prefix={prefix}
        suffix={suffix}
        inactive={inactive}
        fieldValue={fieldValue}
        focus={focus}
      >
        {fieldValue ? (
          <StyledField
            type="text"
            name={fieldName}
            placeholder={placeholder}
            value={fieldValue}
            className={inputClassName}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange?.(event)
            }
            disabled={disabled}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        ) : (
          <StyledField
            id={fieldId}
            component={fieldAs}
            type="text"
            name={fieldName}
            placeholder={placeholder}
            className={inputClassName}
            disabled={disabled}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        )}
      </InputContainer>
      <StyledErrorMessage name={fieldName} component="div" />
    </StyledInput>
  );
};

export default Input;
