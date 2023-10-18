import * as anchor from '@coral-xyz/anchor';
import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor';
import {
  PublicKey,
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
  SYSVAR_RENT_PUBKEY,
  Connection,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createMint,
  NATIVE_MINT,
  getAccount,
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  mintTo,
} from '@solana/spl-token';
import { txOpts } from '../src/config';
import { HelioNftIdl, IDL, PROGRAM_ID } from '../src/program';
import chai, { assert } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import testWallet from './test-wallet.json';

chai.use(chaiAsPromised);

describe('solana-nft', () => {
  let provider: AnchorProvider;
  let connection: Connection;
  let program: Program<HelioNftIdl>;
  let wallet: Wallet;
  let ownerTokenAccount: PublicKey,
    buyerTokenAccount: PublicKey,
    buyerCurrencyAccount: PublicKey,
    ownerCurrencyAccount: PublicKey;
  let mintKey: PublicKey, currencyKey: PublicKey;
  let escrowAccount: Keypair,
    escrowNftAccountKey: PublicKey,
    pda: PublicKey,
    bump: number;
  const payer = Keypair.fromSecretKey(Uint8Array.from(testWallet));
  const ownerMainAccount = Keypair.generate();
  const buyerMainAccount = Keypair.generate();
  let metaMint: PublicKey, metaTokenAccount: PublicKey;
  const helioFeeAccountKey = new PublicKey(
    'FudPMePeNqmnjMX19zEKDfGXpbp6HAdW6ZGprB5gYRTZ'
  );
  const daoFeeAccountKey = new PublicKey(
    'JBGUGPmKUEHCpxGGoMowQxoV4c7HyqxEnyrznVPxftqk'
  );
  let currencyAmount = LAMPORTS_PER_SOL / 100;

  it('Prepares testing environment', async () => {
    connection = new Connection('https://api.devnet.solana.com');
    wallet = new Wallet(ownerMainAccount);
    provider = new anchor.AnchorProvider(connection, wallet, txOpts);
    anchor.setProvider(provider);
    program = new Program<HelioNftIdl>(IDL, PROGRAM_ID, provider);
    // Airdropping tokens to a payer.
    const latestBlockHash = await provider.connection.getLatestBlockhash();

    // const signature = await provider.connection.requestAirdrop(
    //   payer.publicKey,
    //   1.5 * LAMPORTS_PER_SOL
    // );
    // await provider.connection.confirmTransaction(
    //   {
    //     blockhash: latestBlockHash.blockhash,
    //     lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    //     signature,
    //   },
    //   'confirmed'
    // );
    // await sleep(20_000);
    // console.log('Airdrop signature: ', signature);

    const payerBalance = await provider.connection.getBalance(payer.publicKey);
    console.log(
      'Payer ',
      payer.publicKey.toBase58(),
      ' balance: ',
      payerBalance
    );
    // Fund Main Accounts
    const tx = new Transaction();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: ownerMainAccount.publicKey,
        lamports: LAMPORTS_PER_SOL / 10,
      })
    );
    tx.add(
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: buyerMainAccount.publicKey,
        lamports: LAMPORTS_PER_SOL / 10,
      })
    );
    await provider.connection.sendTransaction(tx, [payer]);
    await sleep(20_000);
    const ownerMainAccountBalance = await provider.connection.getBalance(
      ownerMainAccount.publicKey
    );

    mintKey = await createMint(
      provider.connection,
      payer,
      payer.publicKey,
      null,
      0
    );

    ownerTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      payer,
      mintKey,
      ownerMainAccount.publicKey
    );

    await mintTo(
      provider.connection,
      payer,
      mintKey,
      ownerTokenAccount,
      payer,
      1
    );

    await sleep(10_000);
    const _ownerTokenAccount = await getAccount(
      provider.connection,
      ownerTokenAccount
    );
    assert.ok(Number(_ownerTokenAccount.amount) === 1);

    currencyKey = await createMint(
      provider.connection,
      payer,
      payer.publicKey,
      null,
      6
    );

    buyerCurrencyAccount = await createAssociatedTokenAccount(
      provider.connection,
      payer,
      currencyKey,
      buyerMainAccount.publicKey
    );

    const mintAmount = LAMPORTS_PER_SOL;
    await mintTo(
      provider.connection,
      payer,
      currencyKey,
      buyerCurrencyAccount,
      payer,
      mintAmount
    );

    let _buyerCurrencyAccount = await getAccount(
      provider.connection,
      buyerCurrencyAccount
    );
    await sleep(10_000);
    assert.ok(Number(_buyerCurrencyAccount.amount) == mintAmount);
  }).timeout(90_000);

  it('Escrows NFT', async () => {
    escrowAccount = new Keypair();
    const [_pda, _bump] = PublicKey.findProgramAddressSync(
      [escrowAccount.publicKey.toBytes()],
      program.programId
    );
    escrowNftAccountKey = await createAssociatedTokenAccount(
      provider.connection,
      payer,
      mintKey,
      escrowAccount.publicKey
    );
    pda = _pda;
    bump = _bump;
    const unitPrice = new BN(currencyAmount);
    await program.methods
      .escrowNft(unitPrice, new BN(0), bump)
      .accounts({
        owner: ownerMainAccount.publicKey,
        ownerNftAccount: ownerTokenAccount,
        escrowAccount: escrowAccount.publicKey,
        escrowNftAccount: escrowNftAccountKey,
        escrowPda: pda,
        mint: mintKey,
        currency: currencyKey,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([escrowAccount])
      .rpc();
    await sleep(20_000);
    // owner is not the real owner of the token account anymore
    const escrowNftAccount = await getAccount(
      provider.connection,
      escrowNftAccountKey
    );
    assert.ok(escrowNftAccount.owner.equals(pda));
    assert.ok(Number(escrowNftAccount.amount) === 1);

    await assert.isRejected(
      getAccount(provider.connection, ownerTokenAccount),
      TokenAccountNotFoundError
    );

    const _escrowAccount: any = await program.account.escrowAccount.fetch(
      escrowAccount.publicKey.toBase58()
    );
    assert.ok(_escrowAccount.ownerKey.equals(ownerMainAccount.publicKey));
    assert.ok(_escrowAccount.mint.equals(mintKey));
    assert.ok(_escrowAccount.currency.equals(currencyKey));
    assert.ok(Number(_escrowAccount.amount) === 1);
    assert.ok(Number(_escrowAccount.amountSold) === 0);
    assert.ok(Number(_escrowAccount.unitPrice) === unitPrice.toNumber());
    assert.ok(Number(_escrowAccount.bump) === bump);
  }).timeout(90_000);
});

export async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
