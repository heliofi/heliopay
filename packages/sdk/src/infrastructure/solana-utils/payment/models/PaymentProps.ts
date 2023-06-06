import { HelioIdl } from '@heliofi/solana-adapter';
import { Program } from '@project-serum/anchor';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import {
  ErrorPaymentEvent,
  PendingPaymentEvent,
  SuccessPaymentEvent,
} from '../../../../domain';

export interface BasePaymentProps<T> {
  onSuccess: (event: SuccessPaymentEvent<T>) => void;
  onError: (event: ErrorPaymentEvent) => void;
  onPending?: (event: PendingPaymentEvent) => void;
  symbol: string;
  anchorProvider: Program<HelioIdl>;
  wallet: AnchorWallet;
  connection: Connection;
  rateToken?: string;
}
