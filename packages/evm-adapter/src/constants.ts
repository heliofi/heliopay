import { BigNumber, utils } from 'ethers';

// For compability with BE and FE, remove in future
export const contractAddress = '0xa35e123aA4AFeD2E4957897232F2ABf73f34cfB0';

export enum ContractAddresses {
  POLYGON_MUMBAI = '0xa35e123aA4AFeD2E4957897232F2ABf73f34cfB0',
  POLYGON_MAINNET = '0xa35e123aA4AFeD2E4957897232F2ABf73f34cfB0',
  // POLYGON_MAINNET = '0x5a77CE11bCF74E07F2760d610Ba0Aa1DF6887a48',
}

export const gasLimit = BigNumber.from(utils.hexlify('0x100000'));
