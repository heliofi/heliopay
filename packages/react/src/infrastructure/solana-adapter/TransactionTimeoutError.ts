import { getStringBetween } from '../../utils';

export class TransactionTimeoutError extends Error {
  extractSignature(): string | undefined {
    return getStringBetween(this.message, 'signature', 'using');
  }
}
