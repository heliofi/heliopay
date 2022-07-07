import { ErrorMessage } from 'formik';
import styled from 'styled-components';

export const StyledSelectWrapper = styled.div`
  margin-bottom: 12px;
`;

export const StyledSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledSelectHead = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 12px;
  width: 100%;
  justify-content: space-between;
`;

export const StyledSelectLabel = styled.div<{ selected: boolean }>`
  color: ${({ selected }) => (selected ? '#000' : '#5a6578')};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  opacity: ${({ selected }) => (selected ? 1 : 0.5)};
`;

export const StyledSelectIcon = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 8px;

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const StyledSelectDropdownContainer = styled.div`
  outline: none;
`;

export const StyledSelectDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 8px 10px rgba(195, 200, 209, 0.2);
  border-radius: 8px;
  max-height: 192px;
  overflow-y: auto;
  margin-top: 8px;
`;

export const StyledSelectItem = styled.div<{ highlighted: boolean }>`
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

export const StyledErrorMessage = styled(ErrorMessage)`
  color: #ff0000;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 4px;
`;
