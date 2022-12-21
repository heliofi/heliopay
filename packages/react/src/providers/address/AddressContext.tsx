import { Cluster } from '@solana/web3.js';
import { createContext, useContext } from 'react';
import {
  AddressList,
  AddressDetails,
  Country,
} from '../../domain/model/Address';
import { useCompositionRoot } from '../../hooks/compositionRoot';
import { useHelioProvider } from '../helio/HelioContext';

export const AddressContext = createContext<{
  addressList?: AddressList;
  setAddressList: (addressList: AddressList) => void;
  country?: Country;
  setCountry: (country: Country) => void;
  addressDetails?: AddressDetails;
  setAddressDetails: (address: AddressDetails) => void;
}>({
  addressList: undefined,
  setAddressList: () => {},
  country: undefined,
  setCountry: () => {},
  addressDetails: undefined,
  setAddressDetails: () => {},
});

export const useAddressProvider = () => {
  const {
    addressList,
    setAddressList,
    country,
    addressDetails,
    setAddressDetails,
    setCountry,
  } = useContext(AddressContext);
  const { cluster } = useHelioProvider();
  const { apiService } = useCompositionRoot();

  const findAddress = async (query: string, country_code: string) => {
    const result = await apiService.findAddress(
      query,
      country_code,
      cluster as Cluster
    );
    setAddressList(result?.results ?? []);
  };

  const getCountry = async () => {
    const result = await apiService.getCountry(cluster as Cluster);
    setCountry(result ?? {});
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
      const { result } = await apiService.retrieveAddress(
        address_id,
        country_code,
        cluster as Cluster
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
    country,
    findAddress,
    getCountry,
    addressDetails,
    retrieveAddress,
  };
};
