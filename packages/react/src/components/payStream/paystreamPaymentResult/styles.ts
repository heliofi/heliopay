import styled from 'styled-components';

import { rgba } from '../../../utils';
import { Button } from '../../../ui-kits';

export const StyledPPResultWrapper = styled.div``;

export const StyledPPResultBox = styled.div`
  background: #fff;
  border: 1px solid #e3e0e04a;
  box-shadow: 0 8px 10px rgba(195, 200, 209, 0.2);
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
`;

export const StyledPPResultContainer = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgb(128 26 7 / 1);
`;

export const StyledPPResultTime = styled.div`
  width: 7rem;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => rgba(theme.colors.primary, 0.1)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const StyledPPResultLiveTime = styled.h2`
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.75rem;
`;

export const StyledPPResultMaxTime = styled.div`
  font-size: 0.75rem;
  line-height: 1rem;
`;

export const StyledPPResultTopLine = styled.div`
  background: #ffffff;
  border-radius: 8px 8px 0 0;
  height: 8px;
  width: 100%;
  padding: 1rem;
  text-align: right;
`;

export const StyledPPResultInfo = styled.div`
  margin-top: 15px;
  font-size: 0.875rem;
  line-height: 1.75rem;
  row-gap: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledPPResultStreamInfo = styled.p`
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

export const StyledPPResultAmount = styled.div`
  margin-top: 31px;
  font-size: 0.875rem;
  line-height: 1.25rem;
`;

export const StyledPPResultPrice = styled.span`
  font-weight: 700;
`;

export const StyledPPResultButton = styled(Button)`
  margin-top: 28px;
  width: 100%;
  padding-bottom: 0;
  padding-top: 0;
  background: ${({ theme }) => rgba(theme.colors.primary, 0.1)};
  color: ${({ theme }) => theme.colors.primary};
  box-shadow: none;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #ffffff;
  }
`;

export const StyledPPResultButtonText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const StyledPPResultLink = styled.div<{ error?: boolean }>`
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
