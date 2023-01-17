export type LivePriceResponse = {
  rateToken: string;
  rate: number;
  tokenExpiration: number;
};

export type LivePricePayload = {
  amount: number;
  to: string;
  from: string;
};
