import styled from 'styled-components';
import { rgba } from '../../../utils';

export const StyledPPResultWrapper = styled.div``;

export const StyledPPResultBox = styled.div`
  background: #fff;
  border: 1px solid #e3e0e04a;
  box-shadow: 0 8px 10px rgba(195, 200, 209, 0.2);
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
  height: 315px;
  max-height: 100%;
`;

export const StyledPPResultTopLine = styled.div`
  background: #ffffff;
  border-radius: 8px 8px 0 0;
  height: 8px;
  width: 100%;
  padding: 1rem;
  text-align: right;
`;

export const StyledResultContainer = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

export const StyledResultIcon = styled.div<{ error: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 16px;
  background: ${({ error, theme }) =>
    error ? '#FEE3E3' : rgba(theme.colors.primary, 0.1)};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 80px;
    height: 80px;
    fill: ${({ error, theme }) => (error ? '#f87272' : theme.colors.primary)};
  }
  path {
    fill: ${({ error, theme }) => (error ? '#f87272' : theme.colors.primary)};
  }
`;

export const StyledResultTitle = styled.div<{ error: boolean }>`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 125%;
  margin-bottom: 4px;
  color: ${({ error, theme }) => (error ? '#f87272' : theme.colors.primary)};
`;

export const StyledResultText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  color: #8e522e;
  margin-bottom: 1px;
`;

export const StyledResultLink = styled.div<{ error?: boolean }>`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  text-align: center;
  text-decoration-line: underline;
  color: ${({ error, theme }) => (error ? '#f87272' : theme.colors.primary)};
  cursor: pointer;
  text-underline-offset: 2px;

  a {
    text-decoration: none;
    color: inherit;
    font-weight: inherit;
    font-style: inherit;
  }
`;

export const StyledResultFooter = styled.div`
  margin-top: 16px;
`;

export const StyledResultFooterText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  letter-spacing: -0.02em;
  color: #9ca3af;

  a {
    text-decoration: underline;
    color: #f76c1b;
    cursor: pointer;
    text-underline-offset: 2px;
  }
`;

export const StyledSwapWrapper = styled.div`
  margin-top: 0.5rem;
  font-size: 14px;
  line-height: 125%;
  color: #8e522e;
`;
