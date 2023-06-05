import React from 'react';

import { StyledPhantomLogo, StyledPhantomRow } from './styles';

// @ts-ignore @todo-v configure files paths
// import PhantomPurple from '../../../public/PhantomPurple.png';
// TODO: Investigate this issue, causing build failure: https://linear.app/heliofi/issue/FEE-1125/react-button-phantom-logo-breaking-build

const PhantomCompatibleCard = () => (
  <StyledPhantomRow>
    <StyledPhantomLogo>
      {/* <img src={PhantomPurple} alt="Phantom purple" /> */}
    </StyledPhantomLogo>
    <p>Compatible with Phantom wallet</p>
  </StyledPhantomRow>
);

export default PhantomCompatibleCard;
