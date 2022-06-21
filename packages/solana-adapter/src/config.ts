import * as anchor from '@project-serum/anchor';

export const txOpts: anchor.web3.ConfirmOptions = {
  skipPreflight: true,
  commitment: 'confirmed',
  maxRetries: 3,
};
