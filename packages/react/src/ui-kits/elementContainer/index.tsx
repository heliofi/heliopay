import React, { FC } from 'react';

import {
  StyledContainer,
  StyledInactive,
  StyledSuffix,
  StyledPrefix,
} from './styles';

export type ElementContainerProps = {
  className?: string;
  inactive?: boolean;
  placeholder?: string;
  fieldValue?: string | number;
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
  focus?: boolean;
  children?: React.ReactNode
};

const ElementContainer: FC<ElementContainerProps> = ({
  className,
  inactive,
  placeholder,
  fieldValue,
  prefix,
  suffix,
  children,
  focus,
}) => (
  <StyledContainer className={className} focus={focus}>
    {prefix && <StyledPrefix>{prefix}</StyledPrefix>}
    {inactive ? (
      <StyledInactive>{fieldValue ?? placeholder}</StyledInactive>
    ) : (
      children
    )}
    {suffix && <StyledSuffix>{suffix}</StyledSuffix>}
  </StyledContainer>
);

export default ElementContainer;
