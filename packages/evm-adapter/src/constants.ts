import { BigNumber, utils } from 'ethers';

export enum ChainId {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_GOERLI = 5,
  ETHEREUM_SEPOLIA = 11155111,
  POLYGON_MAINNET = 137,
  POLYGON_MUMBAI = 80001,
}

export enum ContractAddress {
  POLYGON_MAINNET = '0x644cF27D0CB17cf252BCfb96e2821fc17109761f',
  POLYGON_MUMBAI = '0x1B43FB8a3c4CC150768C72656C352bdf35Dd1209',
  ETHEREUM_MAINNET = '0xbCe44616D96BA1659FAc008ed3D9f171F67D254e',
  ETHEREUM_GOERLI = '0xbCe44616D96BA1659FAc008ed3D9f171F67D254e',
  ETHEREUM_SEPOLIA = '0xbCe44616D96BA1659FAc008ed3D9f171F67D254e',
}

export const gasLimit = BigNumber.from(utils.hexlify('0x060000'));
