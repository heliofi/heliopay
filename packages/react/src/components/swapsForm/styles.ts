import styled from 'styled-components';

export const StyledSwapsContainer = styled.div`
  margin-bottom: 12px;
`;

export const StyledSpinner = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
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

export const StyledSwapError = styled.p`
  font-size: 14px;
  color: rgb(239, 68, 68);
  margin-bottom: 12px;
  line-height: 125%;
`;

export const StyledTokenSwapQuoteInfo = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 4px;
  line-height: 125%;
  color: #9ca3af;
`;
