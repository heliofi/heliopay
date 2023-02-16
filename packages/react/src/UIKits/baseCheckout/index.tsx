import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import { Form, Formik } from 'formik';
import { CheckoutHeader } from '../../UIKits/checkoutHeader';
import CustomerInfo from '../customerInfo';
import {
  StyledBaseCheckoutWrapper,
  StyledBaseCheckoutContainer,
  StyledBaseCheckoutBody,
} from './styles';

const BaseCheckout = (props: { PricingComponent: FC<unknown> }) => {
  const { PricingComponent } = props;

  return createPortal(
    <StyledBaseCheckoutWrapper>
      <StyledBaseCheckoutContainer>
        <Formik initialValues={{}} onSubmit={() => {}}>
          {({ values, setFieldValue }) => (
            <Form>
              <>
                <CheckoutHeader />
                <StyledBaseCheckoutBody>
                  <PricingComponent />
                  <CustomerInfo values={values} setFieldValue={setFieldValue} />
                </StyledBaseCheckoutBody>
              </>
            </Form>
          )}
        </Formik>
      </StyledBaseCheckoutContainer>
    </StyledBaseCheckoutWrapper>,
    document.body
  );
};

export default BaseCheckout;
