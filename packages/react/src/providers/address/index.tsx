import { FC, ReactNode, useMemo, useState } from 'react';
import {
  AddressDetails,
  AddressList,
  Country,
} from '../../domain/model/Address';
import { AddressContext } from './AddressContext';

export const AddressProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [addressList, setAddressList] = useState<AddressList | undefined>([]);
  const [country, setCountry] = useState<Country | undefined>();
  const [addressDetails, setAddressDetails] = useState<
    AddressDetails | undefined
  >();
  const addressProviderValue = useMemo(
    () => ({
      addressList,
      setAddressList,
      country,
      setCountry,
      addressDetails,
      setAddressDetails,
    }),
    [
      addressList,
      setAddressList,
      country,
      setCountry,
      addressDetails,
      setAddressDetails,
    ]
  );

  return (
    <AddressContext.Provider value={addressProviderValue}>
      {children}
    </AddressContext.Provider>
  );
};
