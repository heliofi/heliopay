import { ChainId, ContractAddress } from './constants';

export const getContractAddress = (chainIdNr: number): string | undefined =>
  chainIdNr in ChainId ? (<any>ContractAddress)[ChainId[chainIdNr]] : undefined;
