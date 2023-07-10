export type RecipientAndAmount = {
  recipient: string;
  amount: bigint;
};

export type PaymentRequest = {
  transactonDbId: string;
  tokenAddres: string;
};
