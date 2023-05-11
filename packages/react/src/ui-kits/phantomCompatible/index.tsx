import React from 'react';

import { StyledPhantomLogo, StyledPhantomRow } from './styles';

const PhantomCompatibleCard = () => (
  <StyledPhantomRow>
    <StyledPhantomLogo>
      <img
        src="https://helio-assets.s3.eu-west-1.amazonaws.com/PhantomPurple.png"
        alt="Phantom purple"
      />
    </StyledPhantomLogo>
    <p>Compatible with Phantom wallet</p>
  </StyledPhantomRow>
);

export default PhantomCompatibleCard;
