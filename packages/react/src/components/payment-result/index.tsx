import { ErrorPaymentEvent, SuccessPaymentEvent } from '../../domain';
import { WarningTriangleIcon } from '@heliofi/helio-icons';
import CheckMarkIcon from '../icons/CheckMarkIcon';
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
} from './styles';

interface Props {
  result: {
    transaction?: string;
    errorMessage?: string;
    content?: string;
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
            <StyledResultLink onClick={() => window.location.reload()}>
              Try again
            </StyledResultLink>
          ) : (
            <StyledResultLink>
              <ExplorerLink transaction={result?.transaction} />
            </StyledResultLink>
          )}
        </StyledResultContainer>
      </StyledResultBox>
      <StyledResultFooter>
        <StyledResultFooterText>
          Need help?{' '}
          <a href="https://www.hel.io/" target={'_blank'} rel="noreferrer">
            Contact Helio
          </a>
        </StyledResultFooterText>
      </StyledResultFooter>
    </StyledResultWrapper>
  );
};

export default PaymentResult;
