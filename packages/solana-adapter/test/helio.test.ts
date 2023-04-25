import * as anchor from '@project-serum/anchor';
import {
  Connection,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { Program, Wallet } from '@project-serum/anchor';
import {
  createAssociatedTokenAccount,
  createMint,
  getAccount,
  mintTo,
} from '@solana/spl-token';
import { assert } from 'chai';
import { describe } from 'mocha';
import { HelioIdl, IDL, PROGRAM_ID } from '../src/program';
import { txOpts } from '../src/config';
import {
  CreatePaymentRequest,
  CancelPaymentRequest,
  SinglePaymentRequest,
  WithdrawRequest,
  TopupRequest,
} from '../src/types';
import testWallet from './test-wallet.json';
import {
  getSinglePaymentTx,
  getSingleSolPaymentTx,
  getCreatePaymentTx,
  getCreateSolPaymentTx,
  getCancelPaymentTx,
  getCancelSolPaymentTx,
  getWithdrawTx,
  getWithdrawSolTx,
  getTopupTx,
  getTopupSolTx,
  signTransaction,
} from '../';

let provider: anchor.AnchorProvider;
let mint;
let sender: Keypair;
let recipient: Keypair;
let paymentAccount: Keypair;
let senderTokenAccount: PublicKey;
let recipientTokenAccount: PublicKey;
let connection: Connection;
let program: Program<HelioIdl>;
let wallet: Wallet;
let paymentSOLBalance: number; // to save for cancel
const baseFee = 0.0035;

async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time);
  });
}

describe('api', () => {
  it('Prepares test state', async () => {
    sender = Keypair.generate();
    recipient = Keypair.generate();
    connection = new Connection('https://api.devnet.solana.com');
    wallet = new Wallet(Keypair.fromSeed(testWallet as Uint8Array));
    provider = new anchor.AnchorProvider(connection, wallet, txOpts);
    anchor.setProvider(provider);
    program = new Program<HelioIdl>(IDL, PROGRAM_ID, provider);
    // Airdrop payer
    const latestBlockHash = await provider.connection.getLatestBlockhash();
    const signature = await provider.connection.requestAirdrop(
      sender.publicKey,
      1.5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(
      {
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature,
      },
      'confirmed'
    );
    await sleep(20 * 1000); // Wait 20 secs for devnet blocks
    let senderBalance = await connection.getBalance(sender.publicKey);
    assert.ok(senderBalance === 1.5 * LAMPORTS_PER_SOL);

    // Fund recipient account
    const tx = new Transaction();
    tx.add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipient.publicKey,
        lamports: LAMPORTS_PER_SOL / 2,
      })
    );

    await provider.sendAndConfirm(tx, [sender]);

    await sleep(20 * 1000); // Wait 20 secs for devnet blocks

    const mintAuthority = Keypair.generate();
    mint = await createMint(
      connection,
      sender,
      mintAuthority.publicKey,
      null,
      6
    );
    // Create token accounts
    senderTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      sender,
      mint,
      sender.publicKey
    );
    recipientTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      sender,
      mint,
      recipient.publicKey
    );
    // Now give some tokens to sender
    await mintTo(
      provider.connection,
      sender,
      mint,
      senderTokenAccount,
      mintAuthority,
      1000000
    );

    const senderTokensInfo = await getAccount(
      provider.connection,
      senderTokenAccount
    );
    console.log(
      'Sender tokens info: Key %s, mint: %s ',
      senderTokensInfo.address.toBase58(),
      mint
    );
    const recipientTokensInfo = await getAccount(
      provider.connection,
      recipientTokenAccount
    );
    senderBalance = await connection.getBalance(sender.publicKey);
    console.log('Sender balance ', senderBalance);
    assert.ok(Number(senderTokensInfo.amount) === 1000000);
    assert.ok(Number(recipientTokensInfo.amount) === 0);
  });

  it('Pays one time with serialized transaction', async () => {
    let recipientTokenAccountLocal = await getAccount(
      connection,
      recipientTokenAccount
    );
    const initialAmount = Number(recipientTokenAccountLocal.amount);

    const request: SinglePaymentRequest = {
      amount: String(1000),
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      mintAddress: mint,
    };

    const singlePaymentTransaction = await getSinglePaymentTx(
      program,
      request,
      0
    );

    const txId = await sendAndConfirm(
      singlePaymentTransaction,
      wallet,
      connection
    );

    console.log('One time payment over SC tx: ', txId);
    recipientTokenAccountLocal = await getAccount(
      connection,
      recipientTokenAccount
    );
    const amount = Number(recipientTokenAccountLocal.amount);
    console.log(amount, ' ', initialAmount);
    assert.ok(amount === initialAmount + 1000);
  });

  it('Splits one time payment - serialized', async () => {
    let recipientTokenAccountLocal = await getAccount(
      provider.connection,
      recipientTokenAccount
    );
    const initialAmount = Number(recipientTokenAccountLocal.amount);

    const remainingAccounts = Array<PublicKey>();
    const remainingAmounts = Array<string>();
    for (let i = 0; i < 4; i++) {
      remainingAccounts.push(recipient.publicKey);
      remainingAccounts.push(recipientTokenAccount);
    }

    const request: SinglePaymentRequest = {
      amount: String(1000),
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      mintAddress: mint,
    };
    const singlePaymentTransaction = await getSinglePaymentTx(
      program,
      request,
      0,
      remainingAmounts,
      remainingAccounts
    );

    const txId = await sendAndConfirm(
      singlePaymentTransaction,
      wallet,
      connection
    );

    await sleep(20 * 1000); // Wait 20 secs for devnet
    recipientTokenAccountLocal = await getAccount(
      provider.connection,
      recipientTokenAccount
    );
    const amount = Number(recipientTokenAccountLocal.amount);
    console.log(
      'Split one time payment tx: ',
      txId,
      'initial amount: ',
      initialAmount,
      'final amount:',
      amount
    );
    assert.ok(amount === initialAmount + 3000); // to same account
  });

  it('Pays SOL one time with serialized transaction', async () => {
    const request: SinglePaymentRequest = {
      amount: String(1e6),
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      mintAddress: mint,
    };

    const recipientBalanceBefore = await connection.getBalance(
      recipient.publicKey
    );

    const singleSolPaymentTransaction = await getSingleSolPaymentTx(
      program,
      request,
      35
    );

    const txId = await sendAndConfirm(
      singleSolPaymentTransaction,
      wallet,
      connection
    );

    await sleep(20 * 1000); // Wait 20 secs for devnet
    const recipientBalance = await connection.getBalance(recipient.publicKey);
    console.log(
      'One time payment over SC tx: ',
      txId,
      'Recipient balance before:',
      recipientBalanceBefore,
      'Recipient balance: ',
      recipientBalance
    );
    assert.ok(
      recipientBalance === recipientBalanceBefore + 1e6 * (1 - baseFee)
    );
  });

  it('Splits onetime SOL payment - serialized', async () => {
    const request: SinglePaymentRequest = {
      amount: String(1e6),
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      mintAddress: mint,
    };

    const remainingAccounts = Array<PublicKey>();
    const remainingAmounts = Array<string>();
    for (let i = 0; i < 10; i++) {
      remainingAmounts.push(String(5e5));
      remainingAccounts.push(recipient.publicKey);
    }

    const recipientBalanceBefore = await connection.getBalance(
      recipient.publicKey
    );

    const singleSolPaymentTransaction = await getSingleSolPaymentTx(
      program,
      request,
      0,
      remainingAmounts,
      remainingAccounts
    );

    const txId = await sendAndConfirm(
      singleSolPaymentTransaction,
      wallet,
      connection
    );

    await sleep(20 * 1000); // Wait 20 secs for devnet
    const recipientBalance = await connection.getBalance(recipient.publicKey);
    console.log(
      'One time payment over SC tx: ',
      txId,
      'Recipient before: ',
      recipientBalanceBefore,
      ' recipient balance: ',
      recipientBalance
    );
    assert.ok(recipientBalance === recipientBalanceBefore + 6e6);
  });

  it('Gets create payment serialized transaction', async () => {
    paymentAccount = new Keypair();
    const startAt = Math.floor(new Date().getTime() / 1000) + 1;
    const endAt = startAt + 100;
    const request: CreatePaymentRequest = {
      amount: String(100000),
      startAt: String(startAt),
      endAt: String(endAt),
      interval: 50,
      mintAddress: mint,
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      paymentAccount: paymentAccount.publicKey,
    };

    const paymentTransaction = await getCreatePaymentTx(program, request, true);

    const txId = await sendAndConfirm(paymentTransaction, wallet, connection);
    console.log('Create tx: ', txId);

    await sleep(20 * 1000); // Wait 20 secs for devnet
    const paymentAccountLocal: any = await program.account.paymentAccount.fetch(
      paymentAccount.publicKey
    );

    // Check that the values in the payment escrow account match what we expect.
    assert.ok(paymentAccountLocal.senderKey.equals(provider.wallet.publicKey));
    assert.ok(paymentAccountLocal.senderTokens.equals(senderTokenAccount));
    assert.ok(paymentAccountLocal.recipientKey.equals(recipient.publicKey));
    assert.ok(
      paymentAccountLocal.recipientTokens.equals(recipientTokenAccount)
    );
    assert.ok(paymentAccountLocal.amount.toNumber() === 100000);
    assert.ok(paymentAccountLocal.interval.toNumber() === 50);
    assert.ok(paymentAccountLocal.payFees);
  }).timeout(40000);

  it('Gets withdraw transaction', async () => {
    const request: WithdrawRequest = {
      recipient: recipient.publicKey,
      payment: paymentAccount.publicKey,
      mintAddress: mint,
    };

    //  Sign with recipient wallet
    let walletRecipient: Wallet = new Wallet(recipient);
    let provider = new anchor.AnchorProvider(
      connection,
      walletRecipient,
      txOpts
    );
    let program = new Program<HelioIdl>(IDL, PROGRAM_ID, provider);

    const withdrawTransaction = await getWithdrawTx(program, request);
    const txId = await sendAndConfirm(
      withdrawTransaction,
      walletRecipient,
      connection
    );
    console.log('withdraw tx: ', txId);

    await sleep(20 * 1000); // Wait 20 secs for devnet
    const recipientTokenAccountLocal = await getAccount(
      provider.connection,
      recipientTokenAccount
    );
    console.log(
      'rec tokens amount: ',
      Number(recipientTokenAccountLocal.amount)
    );
    assert.ok(
      Number(recipientTokenAccountLocal.amount) === 50000 * (1 - baseFee)
    );
  });

  it('Gets topup transaction', async () => {
    let _senderTokenAccountLocal = await getAccount(
      provider.connection,
      senderTokenAccount
    );
    const sendersPriorBalance = _senderTokenAccountLocal.amount;
    let paymentAccountLocal = await program.account.paymentAccount.fetch(
      paymentAccount.publicKey
    );

    const paymentAccountAmountPrior = Number(paymentAccountLocal.amount);
    const paymentAccountEndatPrior = Number(paymentAccountLocal.endAt);

    const topupAmount = 50000;
    const request: TopupRequest = {
      amount: String(topupAmount),
      sender: sender.publicKey,
      payment: paymentAccount.publicKey,
      mintAddress: mint,
    };

    const topupTransaction = await getTopupTx(program, request);
    const txId = await sendAndConfirm(topupTransaction, wallet, connection);
    await sleep(10 * 1000); // Wait 10 secs for devnet to show real data
    console.log('Topup tx: ', txId);
    _senderTokenAccountLocal = await getAccount(
      provider.connection,
      senderTokenAccount
    );
    const sendersBalance = _senderTokenAccountLocal.amount;
    console.log('Sender balance: ', sendersBalance);
    assert.ok(sendersBalance === sendersPriorBalance - 50000n);
    paymentAccountLocal = await program.account.paymentAccount.fetch(
      paymentAccount.publicKey
    );

    const paymentAccountAmount = Number(paymentAccountLocal.amount);
    const paymentAccountEndat = Number(paymentAccountLocal.endAt);
    assert.ok(paymentAccountAmount === paymentAccountAmountPrior + topupAmount);
    assert.ok(paymentAccountEndat === paymentAccountEndatPrior + 50);
  });

  it('Gets cancel payment transaction', async () => {
    await sleep(30 * 1000); // Wait 20 secs for devnet next block
    const request: CancelPaymentRequest = {
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      payment: paymentAccount.publicKey,
      mintAddress: mint,
    };

    const cancelTransaction = await getCancelPaymentTx(program, request);
    const txId = await sendAndConfirm(cancelTransaction, wallet, connection);
    await sleep(20 * 1000); // Wait 10 secs for devnet to show real data
    console.log('cancel tx: ', txId);
    const senderTokenAccountLocal = await getAccount(
      provider.connection,
      senderTokenAccount
    );
    console.log(
      'sender tokens amount: ',
      Number(senderTokenAccountLocal.amount)
    );
    assert.ok(Number(senderTokenAccountLocal.amount) === 900000);
    const recipientTokenAccountLocal = await getAccount(
      provider.connection,
      recipientTokenAccount
    );
    console.log(
      'rec tokens amount: ',
      Number(recipientTokenAccountLocal.amount)
    );
    assert.ok(
      Number(recipientTokenAccountLocal.amount) === 100000 * (1 - baseFee)
    );
  });

  it('Gets SOL payment create transaction', async () => {
    paymentAccount = new Keypair();
    const startAt = Math.floor(new Date().getTime() / 1000) + 1;
    const endAt = startAt + 200;
    const request: CreatePaymentRequest = {
      amount: String(1e6),
      startAt: String(startAt),
      endAt: String(endAt),
      interval: 100,
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      paymentAccount: paymentAccount.publicKey,
    };
    const senderBalanceBefore = await connection.getBalance(sender.publicKey);

    const paymentTransaction = await getCreateSolPaymentTx(
      program,
      request,
      false
    );

    const txId = await sendAndConfirm(paymentTransaction, wallet, connection);
    console.log('Create sol tx: ', txId);

    await sleep(20 * 1000); // Wait 20 secs for devnet

    const paymentAccountLocal: any =
      await program.account.solPaymentAccount.fetch(paymentAccount.publicKey);
    console.log('Escrow payment account: ', paymentAccountLocal);

    // Check that the values in the payment escrow account match what we expect.
    assert.ok(paymentAccountLocal.senderKey.equals(sender.publicKey));
    assert.ok(paymentAccountLocal.recipientKey.equals(recipient.publicKey));
    assert.ok(paymentAccountLocal.amount.toNumber() === 1e6);
    assert.ok(paymentAccountLocal.interval.toNumber() === 100);
    assert.ok(paymentAccountLocal.withdrawal.toNumber() === 0);
    assert.ok(paymentAccountLocal.payFees === false);
    // Check balance of payment account
    const paymentAccountBalance = await connection.getBalance(
      paymentAccount.publicKey
    );
    console.log('Payment bal', paymentAccountBalance); // amount + rent
    assert.ok(paymentAccountBalance > 1e6);
    const senderBalance = await connection.getBalance(sender.publicKey);
    paymentSOLBalance = paymentAccountLocal.amount.toNumber();
    assert.ok(senderBalanceBefore > senderBalance + 1e6); // sender balance = old balance - amount - tx fee - rent
  }).timeout(40000);

  it('Gets sol topup transaction', async () => {
    const sendersPriorBalance = await connection.getBalance(sender.publicKey);
    let solPaymentAccountLocal = await program.account.solPaymentAccount.fetch(
      paymentAccount.publicKey
    );

    const paymentAccountAmountPrior = Number(solPaymentAccountLocal.amount);
    const paymentAccountEndatPrior = Number(solPaymentAccountLocal.endAt);

    const topupAmount = 1e6;
    const request: TopupRequest = {
      amount: String(topupAmount),
      sender: sender.publicKey,
      payment: paymentAccount.publicKey,
      mintAddress: mint,
    };

    const topupTransaction = await getTopupSolTx(program, request);
    const txId = await sendAndConfirm(topupTransaction, wallet, connection);
    await sleep(10 * 1000); // Wait 10 secs for devnet to show real data
    console.log('Topup tx: ', txId);

    const senderBalance = await connection.getBalance(sender.publicKey);
    console.log(
      'Sender balance: ',
      senderBalance,
      ' prior: ',
      sendersPriorBalance
    );
    assert.ok(senderBalance <= sendersPriorBalance - 1e6);
    solPaymentAccountLocal = await program.account.solPaymentAccount.fetch(
      paymentAccount.publicKey
    );

    const paymentAccountAmount = Number(solPaymentAccountLocal.amount);
    const paymentAccountEndat = Number(solPaymentAccountLocal.endAt);
    assert.ok(paymentAccountAmount === paymentAccountAmountPrior + topupAmount);
    assert.ok(paymentAccountEndat === paymentAccountEndatPrior + 200);
  });

  it('Gets withdraw SOL transaction', async () => {
    let walletRecipient: Wallet = new Wallet(recipient);
    let provider = new anchor.AnchorProvider(
      connection,
      walletRecipient,
      txOpts
    );
    let program = new Program<HelioIdl>(IDL, PROGRAM_ID, provider);
    const request: WithdrawRequest = {
      recipient: recipient.publicKey,
      payment: paymentAccount.publicKey,
    };
    const recipientBalanceBefore = await connection.getBalance(
      recipient.publicKey
    );
    const withdrawTransaction = await getWithdrawSolTx(program, request);

    const txId = await sendAndConfirm(
      withdrawTransaction,
      walletRecipient,
      connection
    );
    console.log('withdraw sol tx: ', txId);

    await sleep(20 * 1000); // Wait 20 secs for devnet
    const recipientBalance = await connection.getBalance(recipient.publicKey);
    console.log('rec balance: ', recipientBalance);
    assert.ok(
      recipientBalance < recipientBalanceBefore + 5e5 &&
        recipientBalance > recipientBalanceBefore + 4.5e5
    );
  });

  it('Gets cancel SOL payment transaction', async () => {
    const sendersBalanceBefore = await connection.getBalance(sender.publicKey);
    const request: CancelPaymentRequest = {
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      payment: paymentAccount.publicKey,
    };
    await sleep(15 * 1000);
    const cancelTransaction = await getCancelSolPaymentTx(program, request);

    const txId = await sendAndConfirm(cancelTransaction, wallet, connection);
    console.log('cancel sol tx: ', txId);
    await sleep(20 * 1000);

    const sendersBalance = await connection.getBalance(sender.publicKey);
    console.log(
      'Senders balance before:',
      sendersBalanceBefore,
      'Senders balance: ',
      sendersBalance
    );
    assert.ok(sendersBalance >= sendersBalanceBefore + paymentSOLBalance / 2); // get back rent, half amount, deduct fees
  });
});

async function sendAndConfirm(
  transaction: Transaction,
  wallet: Wallet,
  connection: Connection
) {
  const signedTransaction = await signTransaction(
    transaction,
    wallet,
    connection
  );
  const txId = await connection.sendRawTransaction(
    Buffer.from(JSON.parse(signedTransaction).data)
  );

  await connection.confirmTransaction(txId);
  return txId;
}
