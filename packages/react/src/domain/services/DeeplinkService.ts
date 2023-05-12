import { SOLANA_WALLET_INJECTIONS } from '@heliofi/sdk';

export class DeeplinkService {
  static isSolanaInjected = (): boolean =>
    SOLANA_WALLET_INJECTIONS.some((r: string): boolean => r in window);

  static isEthereumInjected = (): boolean => 'ethereum' in window;

  static getMetaMaskDeeplink = () => 'https://metamask.app.link/dapp/';

  static getPhantomDeeplink = (): string => 'https://phantom.app/ul/browse/';
}
