import { Cluster } from '@solana/web3.js';
import { CustomerDetails } from '../../domain';
import { ProductDetails } from '../../domain/model/ProductDetails';

export interface ApproveTransactionPayload {
  transactionSignature: string;
  paymentRequestId: string;
  amount: number;
  sender: string;
  recipient: string;
  currency: string;
  cluster: Cluster;
  customerDetails?: CustomerDetails;
  productDetails?: ProductDetails;
  quantity?: number;
}
