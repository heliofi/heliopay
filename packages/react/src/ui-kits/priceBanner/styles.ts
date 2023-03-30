import styled from 'styled-components';

import { rgba } from '../../utils';

export const StyledPriceBannerWrapper = styled.div`
  margin-bottom: 20px;
`;

export const StyledPriceBannerLabel = styled.label`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  margin-bottom: 5px;
  color: #9ca3af;
  display: block;
`;

export const StyledPriceBanner = styled.div`
  background: ${({ theme }) => rgba(theme.colors.primary, 0.05)};
  border-radius: 8px;
  padding: 15px;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  color: ${({ theme }) => theme.colors.fontColor};
  margin-bottom: 20px;
  b {
    font-weight: 600;
  }
`;

export const StyledTitle = styled.span``;

export const StyledPrice = styled.span`
  font-weight: bold;
`;
