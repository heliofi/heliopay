export type AddressList = {
  id: string;
  count: number;
  labels: string[];
}[];
export interface AddressDetails {
  city?: string;
  street?: string;
  streetNumber?: string;
  addressLineOne?: string;
}
