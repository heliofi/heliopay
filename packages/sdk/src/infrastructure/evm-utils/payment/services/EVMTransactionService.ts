export class EVMTransactionService {
  static getTransactionSignature(
    transactionString: string
  ): string | undefined {
    const partialTransactionObject: { hash: string } =
      JSON.parse(transactionString);
    return partialTransactionObject?.hash;
  }
}
