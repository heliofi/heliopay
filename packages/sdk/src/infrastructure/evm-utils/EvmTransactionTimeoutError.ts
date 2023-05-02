import { getStringBetween } from '../../utils';
// todo check error type and message and update class name accordingly

export class EvmTransactionTimeoutError extends Error {
  constructor(message?: string) {
    super(message);
  }

  extractSignature(): string | undefined {
    return getStringBetween(this.message, 'signature', 'using');
  }
}
