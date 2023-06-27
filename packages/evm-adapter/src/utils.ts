import { BigNumber, ContractInterface } from 'ethers';
import { helio, helioEth } from './abi';
import { ChainId, ContractAddress } from './constants';
import { PaymentRequest } from './types';

export const getContractAddress = (chainIdNr: number): string | undefined =>
  chainIdNr in ChainId ? (<any>ContractAddress)[ChainId[chainIdNr]] : undefined;

export const getFeesAndAddresses = (req: PaymentRequest) => {
  const feesAndAddresses = req.feesAndAddresses || [];
  return feesAndAddresses.map((feeAndAddress) => ({
    recipient: feeAndAddress.recipient,
    feeBps: BigNumber.from(feeAndAddress.feeBps),
  }));
};

export const isPolygon = (chainId: number) =>
  chainId === ChainId.POLYGON_MUMBAI || chainId === ChainId.POLYGON_MAINNET;

export const getAbi = (chainIdNr: number): ContractInterface =>
  isPolygon(chainIdNr) ? helio.abi : helioEth.abi;
