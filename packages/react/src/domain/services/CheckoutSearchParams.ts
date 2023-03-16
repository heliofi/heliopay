import { CheckoutFormInitialValuesType } from '../../components/baseCheckout/constants';

export type CheckoutSearchParamsValues = Pick<
  CheckoutFormInitialValuesType,
  | 'fullName'
  | 'email'
  | 'discordUsername'
  | 'twitterUsername'
  | 'phoneNumber'
  | 'productValue'
  | 'areaCode'
  | 'state'
  | 'deliveryAddress'
  | 'city'
  | 'street'
  | 'streetNumber'
>;

export class CheckoutSearchParams extends URLSearchParams {
  private readonly initialCheckoutValues: CheckoutSearchParamsValues = {
    fullName: undefined,
    email: undefined,
    discordUsername: undefined,
    twitterUsername: undefined,
    phoneNumber: undefined,
    productValue: undefined,
    areaCode: undefined,
    state: undefined,
    deliveryAddress: undefined,
    city: undefined,
    street: undefined,
    streetNumber: undefined,
  };

  getParsedCheckoutSearchParams(): CheckoutSearchParamsValues {
    const checkoutSearchParamsValues: CheckoutSearchParamsValues = {};
    for (const prop in this.initialCheckoutValues) {
      const value = this.parseField(prop);
      if (value != null) {
        checkoutSearchParamsValues[prop as keyof CheckoutSearchParamsValues] =
          value;
      }
    }
    return checkoutSearchParamsValues;
  }

  parseField(key: string): string | undefined {
    const value = this.get(key);
    if (value != null && value.trim() !== '') {
      return value;
    }
    return undefined;
  }
}
