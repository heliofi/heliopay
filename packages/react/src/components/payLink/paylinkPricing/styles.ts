import styled from 'styled-components';

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
