import { CheckoutSearchParamsValues } from './CheckoutSearchParams';
import { PaymentFeatures } from '../../providers/helio/HelioContext';

export class CheckoutSearchParamsManager {
  private static readonly requiredPropertiesKeysMap = new Map<string, string[]>(
    [
      ['requireEmail', ['email']],
      ['requireFullName', ['fullName']],
      ['requireDiscordUsername', ['discordUsername']],
      ['requireTwitterUsername', ['twitterUsername']],
      [
        'requireDeliveryAddress',
        ['street', 'city', 'streetNumber', 'deliveryAddress', 'areaCode'],
      ],
      ['requirePhoneNumber', ['phoneNumber']],
      ['requireProductDetails', ['productValue']],
    ]
  );

  static getFilteredCheckoutSearchParams(
    paymentData: PaymentFeatures,
    checkoutSearchParams: CheckoutSearchParamsValues | undefined
  ): CheckoutSearchParamsValues | undefined {
    const requiredPropertiesKeys = Array.from(
      CheckoutSearchParamsManager.requiredPropertiesKeysMap.keys()
    );
    const paymentRequestRequiredProperties = Object.fromEntries(
      Object.entries(paymentData).filter(
        ([key, value]) => requiredPropertiesKeys.includes(key) && value === true
      )
    );

    const filteredKeys: string[] = [];

    for (const prop in paymentRequestRequiredProperties) {
      const keysOfValuesToBeApplied =
        CheckoutSearchParamsManager.requiredPropertiesKeysMap.get(prop);
      if (keysOfValuesToBeApplied != null) {
        filteredKeys.push(...keysOfValuesToBeApplied);
      }
    }

    return checkoutSearchParams
      ? Object.fromEntries(
          Object.entries(checkoutSearchParams).filter(([key]) =>
            filteredKeys.includes(key)
          )
        )
      : undefined;
  }
}
