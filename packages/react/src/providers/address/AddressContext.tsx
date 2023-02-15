import { createContext, useContext } from 'react';
import { AddressDetails, AddressList } from '../../domain';
import { useCompositionRoot } from '../../hooks/compositionRoot';

export const AddressContext = createContext<{
  addressList?: AddressList;
  setAddressList: (addressList: AddressList) => void;
  addressDetails?: AddressDetails;
  setAddressDetails: (address: AddressDetails) => void;
}>({
  addressList: undefined,
  setAddressList: () => {},
  addressDetails: undefined,
  setAddressDetails: () => {},
});

export const useAddressProvider = () => {
  const { addressList, setAddressList, addressDetails, setAddressDetails } =
    useContext(AddressContext);

  const { HelioSDK } = useCompositionRoot();

  const findAddress = async (query: string, country_code: string) => {
    const result = await HelioSDK.apiService.findAddress(query, country_code);
    setAddressList(result?.results ?? []);
  };

  const retrieveAddress = async (address_id: string, country_code: string) => {
    if (address_id.startsWith('postal_code_partial=')) {
      const result = {} as any;
      const splitArray = address_id.split('|');
      // eslint-disable-next-line no-restricted-syntax
      for (const item of splitArray) {
        const [key, value] = item.split('=');
        switch (key) {
          case 'town':
            result.town = value;
            break;
          case 'street':
            result.street = value;
            break;
          default:
            break;
        }
      }
      setAddressDetails(result);
    } else {
      const { result } = await HelioSDK.apiService.retrieveAddress(
        address_id,
        country_code
      );
      setAddressDetails({
        city: result.province_name,
        street: [
          result?.street_prefix,
          result?.street_name,
          result?.street_suffix,
        ].join(' '),
        streetNumber: result?.building_number,
        addressLineOne: result?.line_2,
      });
    }
  };

  return {
    addressList,
    findAddress,
    addressDetails,
    retrieveAddress,
  };
};
