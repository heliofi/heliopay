import React, { Dispatch, SetStateAction } from 'react';

import QR from '../../assets/icons/QR';
import Wallet from '../../assets/icons/Wallet';

import { QRButtonWrapper, StyledQRIcon, StyledQRText } from './styles';

type QRButtonProps = {
  showQRCode: boolean;
  setShowQRCode: Dispatch<SetStateAction<boolean>>;
};

const QRButton = ({ setShowQRCode, showQRCode }: QRButtonProps) => (
  <QRButtonWrapper onClick={() => setShowQRCode((prev) => !prev)}>
    {showQRCode ? (
      <>
        <StyledQRText>Connect wallet</StyledQRText>
        <StyledQRIcon>
          <Wallet />
        </StyledQRIcon>
      </>
    ) : (
      <>
        <StyledQRText>Pay with QR</StyledQRText>
        <StyledQRIcon>
          <QR />
        </StyledQRIcon>
      </>
    )}
  </QRButtonWrapper>
);

export default QRButton;
