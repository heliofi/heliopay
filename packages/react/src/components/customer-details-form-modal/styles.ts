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
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export const StyledProductWrapper = styled.div`
  position: relative;
`;

export const StyledProductTooltip = styled.div`
  position: absolute;
  right: 0;
  top: -30px;
`;

export const StyledProductTooltipText = styled.div`
  margin-right: 0;
  margin-left: auto;
  width: content;
  max-width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background: black;
  padding: 8px;
  font-size: 12px;
  color: #ffd4a3;
`;

export const StyledProductTooltipIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;

  svg {
    fill: #9ca3af;
    width: 16px;
    height: 16px;
  }
`;
