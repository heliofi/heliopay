import { getStringBetween } from "../../utils";

export class TransactionTimeoutError extends Error {
  constructor(message?: string) {
    super(message);
  }

  extractSignature(): string | undefined {
    return getStringBetween(this.message, 'signature', 'using');
  }
}
