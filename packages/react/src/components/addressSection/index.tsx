import { PageSearchIcon } from '@heliofi/helio-icons';
import { useSelect } from 'downshift';
import { useEffect } from 'react';
import { useAddressProvider } from '../../providers/address/AddressContext';
import Button from '../button';
import Input from '../input';
import {
  StyledAreaCode,
  StyledButton,
  StyledInput,
  StyledSelectDropdown,
  StyledSelectDropdownContainer,
  StyledSelectItem,
  StyledWrapper,
} from './styles';

type AddressSectionProps = {
  setFieldValue: (field: string, value: string | number) => void;
  areaCodeValue: string;
  countryCode?: string;
};

const AddressSection = ({
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
              placeholder="Postal/Zip code"
              label="Postal/Zip code"
              onFocus={() =>
                addressList && addressList.length > 0 && openMenu()
              }
            />
          </StyledInput>

          <StyledButton>
            <Button
              onClick={() => onChangePostcode(areaCodeValue)}
              type="button"
            >
              <PageSearchIcon />
            </Button>
          </StyledButton>
        </StyledAreaCode>
        <StyledSelectDropdownContainer {...getMenuProps()}>
          {isOpen && (
            <StyledSelectDropdown>
              {addressList?.map((item, index) => {
                const label = item.labels.join(', ');
                return (
                  <StyledSelectItem
                    {...getItemProps({ item, index })}
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${item.id}${index}`}
                    {...getItemProps({
                      item,
                      index,
                    })}
                    onClick={() => {
                      handleRetrieveAddress(item.id);
                      closeMenu();
                    }}
                  >
                    <div>
                      {label.length < 45
                        ? label
                        : `${label.substring(0, 45)}...`}
                    </div>
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
        label="City"
        placeholder="Your city"
      />
      <div className="mb-2 grid grid-cols-5 gap-x-4">
        <div className="col-span-4">
          <Input
            fieldId="street"
            fieldName="street"
            placeholder="Street name"
            label="Street"
          />
        </div>
        <div>
          <Input
            fieldId="streetNumber"
            fieldName="streetNumber"
            placeholder="No."
            label="Number"
          />
        </div>
      </div>
      <div className="mb-2">
        <Input
          fieldId="deliveryAddress"
          fieldName="deliveryAddress"
          placeholder="Building, Apartment, Floor number"
          label="Address line 1"
        />
      </div>
    </StyledWrapper>
  );
};

export default AddressSection;
