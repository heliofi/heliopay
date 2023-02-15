import { BigNumber, utils } from 'ethers';

export enum contractAddresses {
  POLYGON_MUMBAI = '0xa35e123aA4AFeD2E4957897232F2ABf73f34cfB0',
  POLYGON_MAINNET = '0xa35e123aA4AFeD2E4957897232F2ABf73f34cfB0',
}

export const gasLimit = BigNumber.from(utils.hexlify('0x100000'));
