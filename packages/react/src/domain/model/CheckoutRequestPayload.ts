import { Cluster } from '@solana/web3.js';
import { CustomerDetails } from './CustomerDetails';

export interface CheckoutReqPayload {
  paymentRequestId: string;
  amount: number;
  sender: string;
  recipient: string;
  currency: string;
  cluster: Cluster;
  customerDetails?: CustomerDetails;
  quantity?: number;
  signedTx: string;
}
