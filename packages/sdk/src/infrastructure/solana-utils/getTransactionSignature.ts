import { Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

const toArrayBuffer = (buf: Buffer): ArrayBuffer => {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
};

export const getTransactionSignature = (
  serializedTx: string,
  onError?: (...args: unknown[]) => unknown
): string | undefined => {
  try {
    const paredTx = JSON.parse(serializedTx);
    const tx = Transaction.from(paredTx.data);
    const sig = tx.signature;
    if (sig == null) {
      return undefined;
    }
    const key = new Uint8Array(toArrayBuffer(sig));
    return String(bs58.encode(key));
  } catch (e) {
    onError?.(e);
    return undefined;
  }
};
