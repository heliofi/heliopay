export class TransactionTimeoutError extends Error {
  constructor(message?: string) {
    super(message);
  }

  extractSignature(): string | undefined {
    const matches = this.message.match(/(?<=signature\s+).*?(?=\s+using)/gs);
    return matches ? matches[0] : undefined;
  }
}
