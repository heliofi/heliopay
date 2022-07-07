import { useSelect } from 'downshift';

import InputContainer from '../input-container';
import {
  StyledErrorMessage,
  StyledLabel,
  StyledSelectContainer,
  StyledSelectDropdown,
  StyledSelectDropdownContainer,
  StyledSelectHead,
  StyledSelectIcon,
  StyledSelectItem,
  StyledSelectLabel,
  StyledSelectWrapper,
} from './styles';
import { ArrowsDownIcon } from '@heliofi/helio-icons'

interface Option {
  value: number | string;
  label: string;
}

interface Props {
  options: Option[];
  onChange: (option: Option) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  fieldName?: string;
  showValidations?: boolean;
  label?: string;
}

function itemToString(item: Option | null) {
  return item ? item.label : '';
}

const SelectBox = ({
  options,
  onChange,
  value,
  placeholder,
  showValidations = false,
  fieldName,
  className,
  label,
}: Props) => {
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    getLabelProps,
    selectItem,
    closeMenu,
  } = useSelect({
    items: options,
    itemToString,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        onChange(selectedItem);
      }
    },
  });

  return (
    <StyledSelectWrapper className={className}>
      {label && <StyledLabel>{label}</StyledLabel>}
      <InputContainer placeholder={placeholder} focus={isOpen}>
        <StyledSelectContainer>
          <StyledSelectHead {...getToggleButtonProps()}>
            <StyledSelectLabel selected={value} {...getLabelProps()}>
              {value || placeholder}
            </StyledSelectLabel>

            <StyledSelectIcon>
              <ArrowsDownIcon />
            </StyledSelectIcon>
          </StyledSelectHead>
          <StyledSelectDropdownContainer {...getMenuProps()}>
            {isOpen && (
              <StyledSelectDropdown>
                {options.map((item, index) => {
                  return (
                    <StyledSelectItem
                      key={`${item.value}${index}`}
                      highlighted={highlightedIndex === index}
                      {...getItemProps({
                        key: item.label,
                        index,
                        item,
                      })}
                    >
                      <div>
                        {item.label}
                      </div>
                    </StyledSelectItem>
                  );
                })}
              </StyledSelectDropdown>
            )}
          </StyledSelectDropdownContainer>
        </StyledSelectContainer>
      </InputContainer>
      {showValidations && (
        <StyledErrorMessage name={fieldName ?? 'selectbox'} component="div" />
      )}
    </StyledSelectWrapper>
  );
};

export default SelectBox;
