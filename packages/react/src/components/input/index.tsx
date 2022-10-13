import { FormikProps, FormikValues } from 'formik';
import { ChangeEvent, FC, useState } from 'react';

import InputContainer, { InputContainerProps } from '../input-container';
import {
  StyledErrorMessage,
  StyledField,
  StyledInput,
  StyledLabel,
  StyledLabelContainer,
} from './styles';

type InputProps = {
  fieldId: string;
  fieldAs?: string;
  fieldName: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
  inputClassName?: string;
  label?: string;
  component?: React.ComponentType<FormikProps<FormikValues>> | React.ReactNode;
  labelSuffix?: React.ReactNode | string;
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
  onFocus,
  inputClassName = '',
  label,
  labelSuffix,
  component,
}) => {
  const [focus, setFocus] = useState(false);

  return (
    <StyledInput>
      {label && (
        <StyledLabelContainer>
          <StyledLabel htmlFor={fieldId}>{label}</StyledLabel>
          {labelSuffix}
        </StyledLabelContainer>
      )}
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
            onFocus={(event: ChangeEvent<HTMLInputElement>) => {
              setFocus(true);
              onFocus?.(event);
            }}
            onBlur={() => setFocus(false)}
            component={component}
          />
        ) : (
          <StyledField
            id={fieldId}
            component={fieldAs || component}
            type="text"
            name={fieldName}
            placeholder={placeholder}
            className={inputClassName}
            disabled={disabled}
            onFocus={(event: ChangeEvent<HTMLInputElement>) => {
              setFocus(true);
              onFocus?.(event);
            }}
            onBlur={() => setFocus(false)}
          />
        )}
      </InputContainer>
      <StyledErrorMessage name={fieldName} component="div" />
    </StyledInput>
  );
};

export default Input;
