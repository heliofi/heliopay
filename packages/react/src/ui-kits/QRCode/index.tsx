import QRCode from 'react-qr-code';

import { StyledQRCode } from './styles';

type QRCodeProps = {
  phantomDeepLink: string;
};

const QRCodeCard = ({ phantomDeepLink }: QRCodeProps) => (
  <StyledQRCode>
    <QRCode value={phantomDeepLink} size={152} />
  </StyledQRCode>
);

export default QRCodeCard;
