import Input from '../input';
import { StyledNumberButtons, StyledNumberMinus, StyledNumberPlus } from './styles';
import ArrowDown from '../icons/ArrowDown';

interface NumberInputProps {
  fieldId: string;
  fieldName: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  setFieldValue: (field: string, value: number | string) => void;
  label?: string;
}

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
  const handleDecrement = () => {
    if (!value) {
      setFieldValue(fieldName, min);
      return;
    }
    if (value > min) {
      setFieldValue(fieldName, Number(value) - Number(step));
    }
  };

  const handleIncrement = () => {
    if (!value) {
      setFieldValue(fieldName, min);
      return;
    }
    if ((max && value < max) || !max) {
      setFieldValue(fieldName, Number(value) + Number(step));
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]+$/;
    if (re.test(event.target.value)) {
      setFieldValue(fieldName, event.target.value);
    }
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
        <StyledNumberButtons className="mr-2 flex flex-row items-center gap-x-2">
          <StyledNumberMinus
            className="flex h-6 w-6 cursor-pointer select-none items-center justify-center"
            onClick={handleDecrement}
          >
            <ArrowDown />
          </StyledNumberMinus>
          <StyledNumberPlus
            className="flex h-6 w-6 cursor-pointer select-none items-center justify-center"
            onClick={handleIncrement}
          >
            <ArrowDown />
          </StyledNumberPlus>
        </StyledNumberButtons>
      }
    />
  );
};

export default NumberInput;
