import styled from 'styled-components';
import { rgba } from '../../utils';

export const StyledFormWrapper = styled.div``;

export const StyledPrice = styled.div`
  background: ${({ theme }) => rgba(theme.colors.primary, 0.05)};
  border-radius: 8px;
  padding: 15px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 20px;
  b {
    font-weight: 600;
  }
`;

export const StyledFormTitle = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 125%;
  color: #000000;
  margin-bottom: 9px;
`;

export const StyledFormText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  color: #000000;
  margin-bottom: 20px;
`;

export const StyledCurrency = styled.div`
  display: flex;
  align-items: center;
  color: #000;
  font-weight: 400;

  p {
    margin-right: 8px;
  }
`;

export const StyledCurrencySelectIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  * {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
