import styled from 'styled-components';

export const StyledMenuWrapper = styled.div`
  position: relative;
`;

export const StyledMenu = styled.div`
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05),
    0px 8px 10px rgba(195, 200, 209, 0.2);
  border-radius: 8px;
  position: absolute;
  top: 100%;
  margin-top: 10px;
  min-width: 165px;
  overflow: hidden;
`;

export const StyledMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 13px 11px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #fff8f4;
  }
`;

export const StyledMenuIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-right: 11px;

  svg {
    width: 100%;
    height: 100%;
  }
`;
export const StyledMenuLabel = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 125%;
  color: #f76c1b;
`;

export const StyledDropdownButton = styled.div`
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: #9ca3af;
  display: flex;
  align-items: center;
  user-select: none;
`;

export const StyledWalletAddress = styled.span`
  color: ${(props) => props.theme.colors.primary};
  margin-left: 4px;
`;
