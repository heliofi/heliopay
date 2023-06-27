export type RecipientAndAmount = {
  recipient: string;
  amount: bigint;
};

export type FeeAndAddress = {
  recipient: string;
  feeBps: bigint;
};

export type PaymentRequest = {
  walletAddress: string;
  recipientAddress: string;
  amount: bigint;
  fee: number;
  transactonDbId: string;
  tokenAddres?: string;
  feesAndAddresses?: FeeAndAddress[];
};
