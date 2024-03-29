import styled from '../styledComponents';

export const StyledNumberButtons = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledNumberMinus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 28px;
  margin-left: 8px;
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

export const StyledNumberPlus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 24px;
  margin-left: 8px;
  cursor: pointer;
  padding: 4px;

  svg {
    width: 100%;
    height: 100%;
    fill: ${({ theme }) => theme.colors.primary};
  }
`;
