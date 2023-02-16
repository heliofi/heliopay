import React from 'react';
import { MinusIcon, PlusIcon } from '@heliofi/helio-icons';
import Input from '../input';
import {
  StyledNumberButtons,
  StyledNumberMinus,
  StyledNumberPlus,
} from './styles';

type NumberInputProps = {
  fieldId: string;
  fieldName: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  setFieldValue: (field: string, value: number | string) => void;
  label?: string;
};

const NumberInput = ({
  fieldId,
  fieldName,
  placeholder,
  min = 1,
  max,
  step = 1,
  value,
  setFieldValue,
  label,
}: NumberInputProps) => {
  const handleDecrement = (): void => {
    if (!value) {
      setFieldValue(fieldName, min);
      return;
    }
    if (value > min) {
      setFieldValue(fieldName, Number(value) - Number(step));
    }
  };

  const handleIncrement = (): void => {
    if (!value) {
      setFieldValue(fieldName, min);
      return;
    }
    if ((max && value < max) || !max) {
      setFieldValue(fieldName, Number(value) + Number(step));
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): boolean => {
    const re = /^[0-9\b]+$/;
    if (re.test(event.target.value)) {
      setFieldValue(fieldName, event.target.value);
    }
    return true;
  };

  return (
    <Input
      fieldId={fieldId}
      fieldName={fieldName}
      placeholder={placeholder}
      fieldValue={value}
      onChange={handleChange}
      label={label}
      suffix={
        <StyledNumberButtons>
          <StyledNumberMinus onClick={handleDecrement}>
            <MinusIcon />
          </StyledNumberMinus>
          <StyledNumberPlus onClick={handleIncrement}>
            <PlusIcon />
          </StyledNumberPlus>
        </StyledNumberButtons>
      }
    />
  );
};

export default NumberInput;
