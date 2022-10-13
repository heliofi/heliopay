import { ErrorMessage } from 'formik';
import styled from 'styled-components';

export const StyledWrapper = styled.div`
  :root {
    --PhoneInput-color--focus: #03b2cb;
    --PhoneInputInternationalIconPhone-opacity: 0.8;
    --PhoneInputInternationalIconGlobe-opacity: 0.65;
    --PhoneInputCountrySelect-marginRight: 0.35em;
    --PhoneInputCountrySelectArrow-width: 0.3em;
    --PhoneInputCountrySelectArrow-marginLeft: var(
      --PhoneInputCountrySelect-marginRight
    );
    --PhoneInputCountrySelectArrow-borderWidth: 1px;
    --PhoneInputCountrySelectArrow-opacity: 0.45;
    --PhoneInputCountrySelectArrow-color: currentColor;
    --PhoneInputCountrySelectArrow-color--focus: var(--PhoneInput-color--focus);
    --PhoneInputCountrySelectArrow-transform: rotate(45deg);
    --PhoneInputCountryFlag-aspectRatio: 1.5;
    --PhoneInputCountryFlag-height: 1em;
    --PhoneInputCountryFlag-borderWidth: 1px;
    --PhoneInputCountryFlag-borderColor: rgba(0, 0, 0, 0.5);
    --PhoneInputCountryFlag-borderColor--focus: var(--PhoneInput-color--focus);
    --PhoneInputCountryFlag-backgroundColor--loading: rgba(0, 0, 0, 0.1);
  }

  .PhoneInput {
    display: flex;
    align-items: center;
  }

  .PhoneInputInput {
    flex: 1;
    min-width: 0;
    outline: none;
    background: none;
    color: inherit;
    font: inherit;
    border: none;
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    color: #5a6578;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #5a6578;
      opacity: 0.5;
    }
  }

  .PhoneInputCountryIcon {
    width: calc(
      var(--PhoneInputCountryFlag-height) *
        var(--PhoneInputCountryFlag-aspectRatio)
    );
    height: var(--PhoneInputCountryFlag-height);
  }

  .PhoneInputCountryIcon--square {
    width: var(--PhoneInputCountryFlag-height);
  }

  .PhoneInputCountryIcon--border {
    background-color: var(--PhoneInputCountryFlag-backgroundColor--loading);
    box-shadow: 0 0 0 var(--PhoneInputCountryFlag-borderWidth)
        var(--PhoneInputCountryFlag-borderColor),
      inset 0 0 0 var(--PhoneInputCountryFlag-borderWidth)
        var(--PhoneInputCountryFlag-borderColor);
  }

  .PhoneInputCountryIconImg {
    display: block;
    width: 100%;
    height: 100%;
    color: #5a6578;
  }

  .PhoneInputInternationalIconPhone {
    opacity: var(--PhoneInputInternationalIconPhone-opacity);
  }

  .PhoneInputInternationalIconGlobe {
    opacity: var(--PhoneInputInternationalIconGlobe-opacity);
  }

  .PhoneInputCountry {
    position: relative;
    align-self: stretch;
    display: flex;
    align-items: center;
    margin-right: var(--PhoneInputCountrySelect-marginRight);
    margin-left: 0.75rem;
  }

  .PhoneInputCountrySelect {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
    border: 0;
    opacity: 0;
    cursor: pointer;
  }

  .PhoneInputCountrySelect[disabled],
  .PhoneInputCountrySelect[readonly] {
    cursor: default;
  }

  .PhoneInputCountrySelectArrow {
    display: block;
    content: '';
    width: var(--PhoneInputCountrySelectArrow-width);
    height: var(--PhoneInputCountrySelectArrow-width);
    margin-left: var(--PhoneInputCountrySelectArrow-marginLeft);
    border-style: solid;
    border-color: var(--PhoneInputCountrySelectArrow-color);
    border-top-width: 0;
    border-bottom-width: var(--PhoneInputCountrySelectArrow-borderWidth);
    border-left-width: 0;
    border-right-width: var(--PhoneInputCountrySelectArrow-borderWidth);
    transform: var(--PhoneInputCountrySelectArrow-transform);
    opacity: var(--PhoneInputCountrySelectArrow-opacity);
  }

  .PhoneInputCountrySelect:focus
    + .PhoneInputCountryIcon
    + .PhoneInputCountrySelectArrow {
    opacity: 1;
    color: var(--PhoneInputCountrySelectArrow-color--focus);
  }

  .PhoneInputCountrySelect:focus + .PhoneInputCountryIcon--border {
    box-shadow: 0 0 0 var(--PhoneInputCountryFlag-borderWidth)
        var(--PhoneInputCountryFlag-borderColor--focus),
      inset 0 0 0 var(--PhoneInputCountryFlag-borderWidth)
        var(--PhoneInputCountryFlag-borderColor--focus);
  }

  .PhoneInputCountrySelect:focus
    + .PhoneInputCountryIcon
    .PhoneInputInternationalIconGlobe {
    opacity: 1;
    color: var(--PhoneInputCountrySelectArrow-color--focus);
  }
`;

export const StyledLabel = styled.label`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 125%;
  margin-bottom: 5px;
  color: #9ca3af;
  display: block;
`;

export const StyledErrorMessage = styled(ErrorMessage)`
  color: #ff0000;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  margin-top: 4px;
`;
