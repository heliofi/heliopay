import React from 'react';

import { StyledPhantomLogo, StyledPhantomRow } from './styles';

// @ts-ignore
import PhantomPurple from '../../../public/PhantomPurple.png';

const PhantomCompatibleCard = () => (
  <StyledPhantomRow>
    <StyledPhantomLogo>
      <img src={PhantomPurple} alt="Phantom purple" />
    </StyledPhantomLogo>
    <p>Compatible with Phantom wallet</p>
  </StyledPhantomRow>
);

export default PhantomCompatibleCard;
