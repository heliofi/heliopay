import { useEffect } from 'react';
import { useSelect } from 'downshift';
import { SearchIcon } from '@heliofi/helio-icons';

import { shortenString } from '../../utils';
import { Button, Input } from '../../ui-kits';
import { FormikSetFieldValue } from '../baseCheckout/constants';
import { useAddressProvider } from '../../providers/address/AddressContext';

import {
  StyledAreaCode,
  StyledButton,
  StyledInput,
  StyledSelectDropdown,
  StyledSelectDropdownContainer,
  StyledSelectItem,
  StyledWrapper,
  StyledStreetInfo,
  StyledStreet,
  StyledStreetNumber,
} from './styles';

type AddressSectionProps = {
  values: {
    deliveryAddress?: string;
    city?: string;
    streetNumber?: string;
    street?: string;
  };
  setFieldValue: FormikSetFieldValue;
  areaCodeValue: string;
  countryCode?: string;
};

const AddressSection = ({
  values,
  setFieldValue,
  areaCodeValue,
  countryCode,
}: AddressSectionProps) => {
  const { addressList, findAddress, retrieveAddress, addressDetails } =
    useAddressProvider();

  const {
    isOpen = true,
    openMenu,
    getMenuProps,
    getToggleButtonProps,
    getItemProps,
    closeMenu,
  } = useSelect({ items: addressList ?? [] });

  const onChangePostcode = async (areaCode: string) => {
    if (countryCode != null) {
      await findAddress(areaCode, countryCode);
      openMenu();
    }
  };

  const handleRetrieveAddress = async (addressId: string) => {
    if (countryCode != null) {
      await retrieveAddress(addressId, countryCode);
    }
  };

  useEffect(() => {
    if (addressDetails != null) {
      setFieldValue('deliveryAddress', addressDetails.addressLineOne ?? '');
      setFieldValue('city', addressDetails.city ?? '');
      setFieldValue('streetNumber', addressDetails.streetNumber ?? '');
      setFieldValue('street', addressDetails.street ?? '');
    }
  }, [addressDetails, setFieldValue]);

  return (
    <StyledWrapper>
      <div className="relative col-span-3 mb-2">
        <StyledAreaCode>
          <StyledInput>
            <Input
              fieldId="areaCode"
              fieldName="areaCode"
              setFieldValue={setFieldValue}
              required
              placeholder="Postal/Zip code"
              label="Postal/Zip code"
              onFocus={() =>
                addressList && addressList.length > 0 && openMenu()
              }
              nextSibling={
                <StyledButton>
                  <Button
                    {...getToggleButtonProps()}
                    onClick={() => onChangePostcode(areaCodeValue)}
                    type="button"
                  >
                    <SearchIcon />
                  </Button>
                </StyledButton>
              }
            />
          </StyledInput>
        </StyledAreaCode>
        <StyledSelectDropdownContainer {...getMenuProps()}>
          {isOpen && (
            <StyledSelectDropdown>
              {addressList?.map((item, index) => {
                const label = item.labels.join(', ');
                return (
                  <StyledSelectItem
                    {...getItemProps({ item, index })}
                    key={`${item.id}`}
                    {...getItemProps({
                      item,
                      index,
                    })}
                    onClick={() => {
                      handleRetrieveAddress(item.id);
                      closeMenu();
                    }}
                  >
                    <div>{shortenString(label, 45)}</div>
                  </StyledSelectItem>
                );
              })}
            </StyledSelectDropdown>
          )}
        </StyledSelectDropdownContainer>
      </div>

      <Input
        fieldId="city"
        fieldName="city"
        fieldValue={values.city}
        setFieldValue={setFieldValue}
        required
        label="City"
        placeholder="Your city"
      />

      <StyledStreetInfo>
        <StyledStreet>
          <Input
            fieldId="street"
            fieldName="street"
            fieldValue={values.street}
            setFieldValue={setFieldValue}
            required
            placeholder="Street name"
            label="Street"
          />
        </StyledStreet>
        <StyledStreetNumber>
          <Input
            fieldId="streetNumber"
            fieldName="streetNumber"
            fieldValue={values.streetNumber}
            setFieldValue={setFieldValue}
            required
            placeholder="No."
            label="Number"
          />
        </StyledStreetNumber>
      </StyledStreetInfo>

      <Input
        fieldId="deliveryAddress"
        fieldName="deliveryAddress"
        fieldValue={values.deliveryAddress}
        setFieldValue={setFieldValue}
        required
        placeholder="Building, Apartment, Floor number"
        label="Address line 1"
      />
    </StyledWrapper>
  );
};

export default AddressSection;
