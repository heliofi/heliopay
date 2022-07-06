import { Field, ErrorMessage } from 'formik';
import styled from 'styled-components';

export const StyledInput = styled.div`
  margin-bottom: 12px;
`;

export const StyledField = styled(Field)`
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;

  &:focus {
    outline: none;
  }

  ${({ as }) =>
    as === 'textarea' &&
    `
    padding: 12px;
    height: 64px;
  `}
`;

export const StyledErrorMessage = styled(ErrorMessage)`
  color: #ff0000;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 4px;
`;

export const StyledLabel = styled.label`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  margin-bottom: 5px;
  color: #9ca3af;
  display: block;
`;
