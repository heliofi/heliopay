import styled from 'styled-components';

export const StyledWrapper = styled.div`
  *, *:before, *:after {
    box-sizing: border-box;
  }
`;

export const StyledRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  max-width: 270px;
`;

export const StyledLeft = styled.div`
  max-width: 160px;
  flex: 1;
`;

export const StyledRight = styled.div`
  margin-left: 12px;
  font-family: 'Arial', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 140%;
  color: #9ca3af;
`;

export const StyledLogo = styled.div`
  width: 45px;
  height: 16px;
  margin-top: 2px;
  display: block;
`;

export const StyledLogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledErrorMessage = styled.div`
  color: #ff0000;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 4px;
`;

export const StyledEnvironment = styled.div`
  margin-left: 8px;
  background-color: #9ca3af;
  border-radius: 20px;
  padding: 5px 6px 4px;
  margin-top: 4px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.5px;
  line-height: 1;
  color: #fff;
  user-select: none;
`;
