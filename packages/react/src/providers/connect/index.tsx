import { BlockchainEngineType } from '@heliofi/common';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  createContext,
  FC,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAccount } from 'wagmi';

import { ConnectModal } from '../../components/modals/connectModal';
import { useModal } from '../../hooks/modalShown';

export type ErrorFunc = (arg: unknown) => void;

export interface OnConnectOptions {
  blockchainEngine?: BlockchainEngineType;
}

interface ConnectOptions {
  onConnect: (options: OnConnectOptions) => void;
  setErrorHandler?: (handler?: ErrorFunc) => void;
  getErrorHandler?: () => ErrorFunc | undefined;
  setIsConnecting: (isConnecting: boolean) => void;
  isExtensionOpen: boolean;
  blockchainEngineRef: MutableRefObject<BlockchainEngineType | undefined>;
}

export const ConnectContext = createContext<ConnectOptions>({
  onConnect: (options: OnConnectOptions) => undefined,
  setIsConnecting: (isConnecting: boolean) => undefined,
  isExtensionOpen: false,
  blockchainEngineRef: { current: undefined },
});

const ConnectProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { connected: isConnectedSOl } = useWallet();
  const { isConnected: isConnectedEVM } = useAccount();

  const { isModalShown, toggleModal, closeModal, openModal } = useModal();

  const [isExtensionOpen, setIsExtensionOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const onErrorRef = useRef<ErrorFunc>();
  const blockchainEngineRef = useRef<BlockchainEngineType | undefined>(
    undefined
  );

  const getErrorHandler = useCallback(() => onErrorRef.current, []);

  useEffect(() => {
    if (!isConnecting) {
      if (isConnectedEVM) {
        blockchainEngineRef.current = BlockchainEngineType.EVM;
      } else if (isConnectedSOl) {
        blockchainEngineRef.current = BlockchainEngineType.SOL;
      } else {
        blockchainEngineRef.current = undefined;
      }
    }
  }, [isConnecting, isConnectedSOl, isConnectedEVM, isModalShown]);

  useEffect(() => {
    if (isConnecting && (isConnectedSOl || isConnectedEVM)) {
      setIsConnecting(false);
      setIsExtensionOpen(true);
      closeModal();
    }
  }, [
    isConnecting,
    closeModal,
    getErrorHandler,
    isConnectedEVM,
    isConnectedSOl,
  ]);

  const onConnect = ({ blockchainEngine }: OnConnectOptions): void => {
    blockchainEngineRef.current = blockchainEngine;
    openModal();
  };

  const connectProviderValues = useMemo(
    () => ({
      onConnect,
      setErrorHandler: (handler?: ErrorFunc) => {
        onErrorRef.current = handler;
      },
      getErrorHandler: () => onErrorRef.current,
      setIsConnecting,
      isExtensionOpen,
      blockchainEngineRef,
    }),
    [
      onConnect,
      onErrorRef.current,
      setIsConnecting,
      isExtensionOpen,
      blockchainEngineRef,
    ]
  );

  return (
    <ConnectContext.Provider value={connectProviderValues}>
      {children}
      <ConnectModal
        blockchainEngine={blockchainEngineRef.current}
        isModalShown={isModalShown}
        onHide={() => toggleModal()}
      />
    </ConnectContext.Provider>
  );
};

export default ConnectProvider;
