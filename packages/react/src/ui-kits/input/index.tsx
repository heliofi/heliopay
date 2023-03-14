import React, { ChangeEvent, FC, useState } from 'react';
import { FormikProps, FormikValues } from 'formik';

import { FormikSetFieldValue } from '../../components/baseCheckout/constants';
import ElementContainer, { ElementContainerProps } from '../elementContainer';

import {
  StyledErrorMessage,
  StyledField,
  StyledInput,
  StyledLabel,
  StyledLabelContainer,
  StyledInputContainer
} from './styles';

type InputProps = {
  fieldId: string;
  fieldName: string;
  disabled?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: ChangeEvent<HTMLInputElement>) => void;
  inputClassName?: string;
  label?: string;
  required?: boolean;
  component?: React.ComponentType<FormikProps<FormikValues>> | React.ReactNode;
  labelSuffix?: React.ReactNode | string;
  placeholder?: string;
  fieldValue?: string | number;
  setFieldValue?: FormikSetFieldValue;
  nextSibling?: React.ReactNode
};

const Input: FC<InputProps & ElementContainerProps> = ({
  fieldId,
  fieldName,
  disabled,
  onChange,
  onFocus,
  inputClassName = '',
  label,
  required,
  component,
  labelSuffix,
  placeholder,
  fieldValue,
  setFieldValue,
  prefix,
  suffix,
  inactive,
  nextSibling = ''
}) => {
  const [focus, setFocus] = useState(false);

  const onChangeField = (event: ChangeEvent<HTMLInputElement>) =>
    onChange?.(event) || setFieldValue?.(fieldName, event.target.value);

  const onFocusField = (event: ChangeEvent<HTMLInputElement>): void => {
    setFocus(true);
    onFocus?.(event);
  };

  const onBlurField = (): void => {
    setFocus(false);
  };

  return (
    <StyledInput>
      {label && (
        <StyledLabelContainer>
          <StyledLabel htmlFor={fieldId} required={!!required}>
            {label}
          </StyledLabel>
          {labelSuffix}
        </StyledLabelContainer>
      )}
      <StyledInputContainer>
        <ElementContainer
          placeholder={placeholder}
          fieldValue={fieldValue}
          prefix={prefix}
          suffix={suffix}
          inactive={inactive}
          focus={focus}
        >
          <StyledField
            id={fieldId}
            name={fieldName}
            disabled={disabled}
            placeholder={placeholder}
            value={fieldValue}
            className={inputClassName}
            onChange={onChangeField}
            onFocus={onFocusField}
            onBlur={onBlurField}
            component={component}
          />
        </ElementContainer>
        {nextSibling}
      </StyledInputContainer>
      <StyledErrorMessage name={fieldName} component="div" />
    </StyledInput>
  );
};

export default Input;
