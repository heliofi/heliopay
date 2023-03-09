import styled from 'styled-components';
import { Field, ErrorMessage } from 'formik';

export const StyledInput = styled.div`
  margin-bottom: 12px;
  user-select: none;
`;

export const StyledField = styled(Field)`
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #5a6578;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #5a6578;
    opacity: 0.5;
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

export const StyledLabel = styled.label<{ required: boolean }>`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  margin-bottom: 5px;
  color: #9ca3af;
  display: block;

  ${({ required, theme }) => `
    ${
      required &&
      `
      &:after {
        content: ' *';
        color: ${theme.colors.primary};
      }
      `
    };
  `}
`;

export const StyledLabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledInputContainer = styled.div`
  display: flex;
`;
