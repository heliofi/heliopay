import styled from 'styled-components';

export const StyledResultWrapper = styled.div``;

export const StyledResultBox = styled.div`
  box-shadow: 0px 8px 10px rgba(195, 200, 209, 0.2);
  border-radius: 8px;
  width: 400px;
  max-width: 100%;
  height: 315px;
  max-height: 100%;
`;

export const StyledResultTopLine = styled.div<{ error: boolean }>`
  background: ${({ error }) =>
    error
      ? '#F87272'
      : 'linear-gradient( 89.94deg,#d8d9f5 -2.46%,#feeef6 27.73%,#feede3 63.77%,#fffdf5 103.56%)'};
  border-radius: 8px 8px 0px 0px;
  height: 8px;
  width: 100%;
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
  background: ${({ error }) => (error ? '#FEE3E3' : '#FFF4ED')};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 80px;
    height: 80px;
  }
`;

export const StyledResultTitle = styled.div<{ error: boolean }>`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 125%;
  margin-bottom: 4px;
  color: ${({ error }) => (error ? '#f87272' : '#8E522E')};
`;

export const StyledResultText = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  color: #8e522e;
  margin-bottom: 4px;
`;

export const StyledResultLink = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  text-align: center;
  text-decoration-line: underline;
  color: #f76c1b;
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
