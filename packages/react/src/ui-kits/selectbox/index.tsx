import React, { ReactNode } from 'react';

import { useSelect } from 'downshift';
import { ArrowsDownIcon } from '@heliofi/helio-icons';

import ElementContainer from '../elementContainer';

import {
  StyledErrorMessage,
  StyledLabel,
  StyledSelectContainer,
  StyledSelectDropdown,
  StyledSelectDropdownContainer,
  StyledSelectHead,
  StyledSelectIcon,
  StyledSelectItem,
  StyledSelectItemIcon,
  StyledSelectLabel,
  StyledSelectWrapper,
} from './styles';

export interface Option {
  value: number | string;
  label: string;
  icon?: ReactNode;
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
  prefix?: React.ReactNode | string;
  required?: boolean;
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
  prefix,
  required,
}: Props) => {
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
    highlightedIndex,
    getLabelProps,
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
      {label && <StyledLabel required={!!required}>{label}</StyledLabel>}
      <ElementContainer
        prefix={prefix}
        placeholder={placeholder}
        focus={isOpen}
      >
        <StyledSelectContainer>
          <StyledSelectHead {...getToggleButtonProps()}>
            <StyledSelectLabel selected={!!value} {...getLabelProps()}>
              {value || placeholder}
            </StyledSelectLabel>

            <StyledSelectIcon>
              <ArrowsDownIcon />
            </StyledSelectIcon>
          </StyledSelectHead>
          <StyledSelectDropdownContainer {...getMenuProps()}>
            {isOpen && (
              <StyledSelectDropdown>
                {options.map((item, index) => (
                  <StyledSelectItem
                    key={`${item.value}`}
                    highlighted={highlightedIndex === index}
                    {...getItemProps({
                      key: item.label,
                      index,
                      item,
                    })}
                  >
                    {item.icon && (
                      <StyledSelectItemIcon>{item.icon}</StyledSelectItemIcon>
                    )}
                    <div>{item.label}</div>
                  </StyledSelectItem>
                ))}
              </StyledSelectDropdown>
            )}
          </StyledSelectDropdownContainer>
        </StyledSelectContainer>
      </ElementContainer>
      {showValidations && (
        <StyledErrorMessage name={fieldName ?? 'selectbox'} component="div" />
      )}
    </StyledSelectWrapper>
  );
};

export default SelectBox;
