import styled from 'styled-components';

export const StyledContainer = styled.div<{ focus?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #ececec;
  border-radius: 8px;
  min-height: 48px;
  position: relative;
  transition: all 0.3s ease-in-out;

  ${({ focus }) =>
    focus &&
    `
        border-color: #F76C1B;
    `}
`;

export const StyledPrefix = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  margin-left: 12px;
`;

export const StyledSuffix = styled.span`
  margin-right: 12px;
`;

export const StyledInactive = styled.div`
  border: none;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #9ca3af;
  cursor: not-allowed;
`;
