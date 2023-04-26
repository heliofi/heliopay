import styled from '../styledComponents';
import { Button } from '../button';

export const StyledButton = styled(Button)`
  :disabled {
    background: #f76c1b;
    color: #fff;
  }

  :hover {
    background: #cf5014 !important;
    color: #fff;
  }
`;

export const ConnectButtonConnecting = styled.div`
  display: flex;
  align-items: center;
`;
