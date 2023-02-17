import styled from 'styled-components';

export const StyledWrapper = styled.div``;

export const StyledAreaCode = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const StyledInput = styled.div`
  width: 100%;
  height: 102px;
`;

export const StyledButton = styled.div`
  height: 48px;
  width: 48px;
  color: #fff;
  margin-bottom: 12px;
  margin-left: 12px;

  svg,
  path {
    fill: currentColor;
  }
`;

export const StyledSelectDropdownContainer = styled.div`
  outline: none;
  position: relative;
`;

export const StyledSelectDropdown = styled.div`
  position: absolute;
  top: -15px;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 8px 10px rgba(195, 200, 209, 0.2);
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 8px;
  z-index: 2;
`;

export const StyledSelectItem = styled.div<{ highlighted: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  color: #000000;

  &:hover {
    background-color: #fff4ed;
  }

  ${({ highlighted }) =>
    highlighted &&
    `
        background-color: #FFF4ED;
    `}
`;

export const StyledLabel = styled.label`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  margin-bottom: 5px;
  color: #9ca3af;
  display: block;
`;

export const StyledStreetInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const StyledStreet = styled.div`
  width: 75%;
`;

export const StyledStreetNumber = styled.div`
  width: 20%;
`;
