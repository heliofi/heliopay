import React from 'react';

import { StyledPhantomLogo, StyledPhantomRow } from './styles';

// @ts-ignore @todo-v configure files paths
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
