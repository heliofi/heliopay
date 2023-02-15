export class VerificationError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, VerificationError.prototype);
  }
}
