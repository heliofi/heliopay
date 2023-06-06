import React, { FC } from 'react';

import Alarm from './Alarm';
import QR from './QR';
import { Stop } from './Stop';
import Wallet from './Wallet';
import HelioIcon from './HelioIcon';
import Cross from './Cross';
import SOLWhite from './SOLWhite';
import ETHWhite from './ETHWhite';
import SOL from './SOL';
import ETH from './ETH';
import ArrowRightCircle from './ArrowRightCircle';
import ArrowUp from './ArrowUp';
import ArrowDown from './ArrowDown';
import PolygonSM from './PolygonSM';
import EthSM from './EthSm';
import SOLSM from './SOLSM';

export type IconProps = {
  iconName?: string;
  gradient: boolean;
};

export const Factory: FC<IconProps> = ({ iconName, gradient }) => {
  switch (iconName) {
    case 'ALARM':
      return <Alarm />;
    case 'QR':
      return <QR />;
    case 'STOP':
      return <Stop />;
    case 'Wallet':
      return <Wallet />;
    case 'Cross':
      return <Cross />;
    case 'SOL':
      return <SOL gradient={gradient} />;
    case 'SOLWhite':
      return <SOLWhite />;
    case 'ETHWhite':
      return <ETHWhite />;
    case 'ETH':
      return <ETH />;
    case 'ArrowRightCircle':
      return <ArrowRightCircle />;
    case 'ArrowUp':
      return <ArrowUp />;
    case 'ArrowDown':
      return <ArrowDown />;
    case 'PolygonSM':
      return <PolygonSM />;
    case 'EthSM':
      return <EthSM />;
    case 'SOLSM':
      return <SOLSM />;
    default:
      return <HelioIcon />;
  }
};
