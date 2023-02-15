import { FC, ReactNode, useMemo, useState } from 'react';
import { AddressContext } from './AddressContext';
import { AddressDetails, AddressList } from '../../domain';

export const AddressProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [addressList, setAddressList] = useState<AddressList | undefined>([]);
  const [addressDetails, setAddressDetails] = useState<
    AddressDetails | undefined
  >();
  const addressProviderValue = useMemo(
    () => ({
      addressList,
      setAddressList,
      addressDetails,
      setAddressDetails,
    }),
    [addressList, setAddressList, addressDetails, setAddressDetails]
  );

  return (
    <AddressContext.Provider value={addressProviderValue}>
      {children}
    </AddressContext.Provider>
  );
};
