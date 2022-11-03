import { FC } from 'react';
import {
  StyledInputContainer,
  StyledInputInactive,
  StyledInputPrefix,
  StyledInputSuffix,
} from './styles';

export type InputContainerProps = {
  className?: string;
  inactive?: boolean;
  placeholder?: string;
  fieldValue?: string | number;
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
  focus?: boolean;
  children?: React.ReactNode;
};

const InputContainer: FC<InputContainerProps> = ({
  className,
  inactive,
  placeholder,
  fieldValue,
  prefix,
  suffix,
  children,
  focus,
}) => (
  <StyledInputContainer className={className} focus={focus}>
    {prefix && <StyledInputPrefix>{prefix}</StyledInputPrefix>}
    {inactive ? (
      <StyledInputInactive>{fieldValue ?? placeholder}</StyledInputInactive>
    ) : (
      children
    )}
    {suffix && <StyledInputSuffix>{suffix}</StyledInputSuffix>}
  </StyledInputContainer>
);

export default InputContainer;
