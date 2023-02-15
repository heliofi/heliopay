import { BigNumber, utils } from 'ethers';

export enum contractAddresses {
  POLYGON_MUMBAI = '0x707Cad6EDB79eE9F64818B09F14A7Aa7f4910e93',
  POLYGON_MAINNET = '0x707Cad6EDB79eE9F64818B09F14A7Aa7f4910e93',
}

export const gasLimit = BigNumber.from(utils.hexlify('0x100000'));
