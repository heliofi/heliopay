import { WarningTriangleIcon } from '@heliofi/helio-icons';
import CheckMarkIcon from '../../assets/icons/CheckMarkIcon';
import ExplorerLink from '../explorer-link';
import {
  StyledResultBox,
  StyledResultContainer,
  StyledResultFooter,
  StyledResultFooterText,
  StyledResultIcon,
  StyledResultLink,
  StyledResultText,
  StyledResultTitle,
  StyledResultTopLine,
  StyledResultWrapper,
  StyledSwapWrapper,
} from './styles';

interface Props {
  result: {
    transaction?: string;
    errorMessage?: string;
    content?: string;
    swapTransaction?: string;
  };
}

const PaymentResult = ({ result }: Props) => {
  const hasError = result?.errorMessage;
  return (
    <StyledResultWrapper>
      <StyledResultBox>
        <StyledResultTopLine error={!!hasError} />
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
      </StyledResultBox>
      <StyledResultFooter>
        <StyledResultFooterText>
          Need help?{' '}
          <a href="https://www.hel.io/" target="_blank" rel="noreferrer">
            Contact Helio
          </a>
        </StyledResultFooterText>
      </StyledResultFooter>
    </StyledResultWrapper>
  );
};

export default PaymentResult;
