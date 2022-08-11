import { TransactionTimeoutError } from '../TransactionTimeoutError';

describe('extractSignatureFromError', () => {
  it('should extract signature form error message', () => {
    const error = new TransactionTimeoutError(
      'Error: Transaction was not confirmed in 30.00 seconds. It is unknown if it succeeded or failed. Check signature 3tH9C2NcEC1WsyxKvT7z7PFnTX9ccYp3enAo3fLqTZeDzg8BLP7dSVp4pMjzMdYmG5AXas1VUNjHMBhinRZMaS82 using the Solana Explorer or CLI tools.'
    );
    expect(error.extractSignature()).toEqual(
      '3tH9C2NcEC1WsyxKvT7z7PFnTX9ccYp3enAo3fLqTZeDzg8BLP7dSVp4pMjzMdYmG5AXas1VUNjHMBhinRZMaS82'
    );
  });

  it('should return undefined when error type differs', () => {
    const error = new TransactionTimeoutError('Error: another error');
    expect(error.extractSignature()).toEqual(undefined);
  });
});
