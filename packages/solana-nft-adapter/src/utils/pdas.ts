import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID as METAPLEX_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';

export function deriveMetadataPDA(mint: PublicKey): PublicKey {
  const seeds = [
    Buffer.from('metadata'),
    METAPLEX_METADATA_PROGRAM_ID.toBuffer(),
    mint.toBuffer(),
  ];

  const [pda] = PublicKey.findProgramAddressSync(
    seeds,
    METAPLEX_METADATA_PROGRAM_ID
  );
  return pda;
}

export function deriveEditionPDA(key: PublicKey): PublicKey {
  const seeds = [
    Buffer.from('metadata'),
    METAPLEX_METADATA_PROGRAM_ID.toBuffer(),
    key.toBuffer(),
    Buffer.from('edition'),
  ];

  const [pda] = PublicKey.findProgramAddressSync(
    seeds,
    METAPLEX_METADATA_PROGRAM_ID
  );
  return pda;
}

export function deriveTokenRecordPDA(
  mint: PublicKey,
  token: PublicKey
): PublicKey {
  const seeds = [
    Buffer.from('metadata'),
    METAPLEX_METADATA_PROGRAM_ID.toBuffer(),
    mint.toBuffer(),
    Buffer.from('token_record'),
    token.toBuffer(),
  ];

  const [pda] = PublicKey.findProgramAddressSync(
    seeds,
    METAPLEX_METADATA_PROGRAM_ID
  );
  return pda;
}
