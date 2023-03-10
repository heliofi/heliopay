import React from 'react';
import { WarningTriangleIcon } from '@heliofi/helio-icons';

import { ExplorerLink } from '../../../ui-kits';
import CheckMarkIcon from '../../../assets/icons/CheckMarkIcon';

import {
  StyledPPResultWrapper,
  StyledPPResultBox,
  StyledResultContainer,
  StyledResultFooter,
  StyledResultFooterText,
  StyledResultIcon,
  StyledResultLink,
  StyledResultText,
  StyledResultTitle,
  StyledPPResultTopLine,
  StyledSwapWrapper,
} from './styles';
import Alarm from '../../../assets/icons/Alarm';

interface Props {
  result: {
    transaction?: string;
    errorMessage?: string;
    content?: string;
    swapTransaction?: string;
  };
}

// @todo-v
const PaystreamPaymentResult = ({ result }: Props) => {
  const hasError = result?.errorMessage;
  return (
    <StyledPPResultWrapper>
      <StyledPPResultBox>
        <StyledPPResultTopLine>
          <Alarm />
        </StyledPPResultTopLine>

        <StyledResultContainer>
          <StyledResultIcon error={!!hasError}>
            {hasError ? <WarningTriangleIcon /> : <CheckMarkIcon />}
          </StyledResultIcon>
          <StyledResultTitle error={!!hasError}>
            {hasError ? 'Transaction failed' : 'Success!'}
          </StyledResultTitle>
          <StyledResultText>
            {hasError
              ? `We couldn't process this transaction.`
              : 'Transaction confirmed'}
          </StyledResultText>
          <StyledResultText>{result?.errorMessage}</StyledResultText>
          {hasError ? (
            <StyledResultLink error onClick={() => window.location.reload()}>
              Try again
            </StyledResultLink>
          ) : (
            <>
              <StyledResultLink>
                <ExplorerLink transaction={result?.transaction} />
              </StyledResultLink>
              {result?.swapTransaction && (
                <StyledSwapWrapper>
                  Swap transaction
                  <StyledResultLink>
                    <ExplorerLink transaction={result?.transaction} />
                  </StyledResultLink>
                </StyledSwapWrapper>
              )}
            </>
          )}
        </StyledResultContainer>
      </StyledPPResultBox>
      <StyledResultFooter>
        <StyledResultFooterText>
          Need help?{' '}
          <a href="https://www.hel.io/" target="_blank" rel="noreferrer">
            Contact Helio
          </a>
        </StyledResultFooterText>
      </StyledResultFooter>
    </StyledPPResultWrapper>
  );
};

export default PaystreamPaymentResult;
