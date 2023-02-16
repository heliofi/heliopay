import { BigNumber, utils } from 'ethers';

export enum ChainId {
  ETHEREUM_MAINNET = 1,
  GOERLI = 5,
  POLYGON_MAINNET = 137,
  POLYGON_MUMBAI = 80001,
}

export enum ContractAddress {
  POLYGON_MUMBAI = '0x1B43FB8a3c4CC150768C72656C352bdf35Dd1209',
  POLYGON_MAINNET = '0x644cF27D0CB17cf252BCfb96e2821fc17109761f',
}

export const gasLimit = BigNumber.from(utils.hexlify('0x100000'));
