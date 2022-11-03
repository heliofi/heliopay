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
  CreatePaymentStateRequest,
  CancelPaymentRequest,
  SinglePaymentRequest,
  WithdrawRequest,
} from '../src/types';

import {
  createPayment,
  withdraw,
  cancelPayment,
  singlePayment,
  createSolPayment,
  withdrawSol,
  cancelSolPayment,
  singleSolPayment,
  getSinglePaymentSignedTx,
  getSingleSolPaymentSignedTx,
  getCreatePaymentSignedTx,
  getCreateSolPaymentSignedTx,
  getCancelPaymentSignedTx,
  getCancelSolPaymentSignedTx,
  getWithdrawSignedTx,
  getWithdrawSolSignedTx,
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
let paymentStatePaymentRequestId: string; // to create payment state we need payment request
let userPaymentRequestsId: string;
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
    wallet = new Wallet(sender);
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

  // it('Pays one time with serialized transaction', async () => {
  //   let recipientTokenAccountLocal = await getAccount(
  //     connection,
  //     recipientTokenAccount
  //   );
  //   const initialAmount = Number(recipientTokenAccountLocal.amount);

  //   const request: SinglePaymentRequest = {
  //     amount: 1000,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     mintAddress: mint,
  //     cluster: 'devnet',
  //   };

  //   const singlePaymentTransactionSerialized = await getSinglePaymentSignedTx(
  //     connection,
  //     wallet,
  //     program,
  //     request,
  //     false
  //   );

  //   // console.log('serialized: ', singlePaymentTransactionSerialized);

  //   const txId = await sendAndConfirm(singlePaymentTransactionSerialized);

  //   console.log('One time payment over SC tx: ', txId);
  //   recipientTokenAccountLocal = await getAccount(
  //     connection,
  //     recipientTokenAccount
  //   );
  //   const amount = Number(recipientTokenAccountLocal.amount);
  //   console.log(amount, ' ', initialAmount);
  //   assert.ok(amount === initialAmount + 1000);
  // });

  // it('Splits one time payment - serialized', async () => {
  //   let recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   const initialAmount = Number(recipientTokenAccountLocal.amount);

  //   const remainingAccounts = Array<PublicKey>();
  //   const remainingAmounts = Array<number>();
  //   for (let i = 0; i < 4; i++) {
  //     const newRecipient = new Keypair();
  //     remainingAmounts.push(500);
  //     remainingAccounts.push(recipient.publicKey);
  //     remainingAccounts.push(recipientTokenAccount);
  //   }

  //   const request: SinglePaymentRequest = {
  //     amount: 1000,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     mintAddress: mint,
  //     cluster: 'devnet',
  //   };
  //   const singlePaymentTransactionSerialized = await getSinglePaymentSignedTx(
  //     connection,
  //     wallet,
  //     program,
  //     request,
  //     false,
  //     remainingAmounts,
  //     remainingAccounts
  //   );

  //   const txId = await sendAndConfirm(singlePaymentTransactionSerialized);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   const amount = Number(recipientTokenAccountLocal.amount);
  //   console.log(
  //     'Split one time payment tx: ',
  //     txId,
  //     'initial amount: ',
  //     initialAmount,
  //     'final amount:',
  //     amount
  //   );
  //   assert.ok(amount === initialAmount + 3000); // to same account
  // });

  // it('Pays SOL one time with serialized transaction', async () => {
  //   const request: SinglePaymentRequest = {
  //     amount: 1e6,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     mintAddress: mint,
  //     cluster: 'devnet',
  //   };

  //   const recipientBalanceBefore = await connection.getBalance(
  //     recipient.publicKey
  //   );

  //   const singleSolPaymentTransactionSerialized =
  //     await getSingleSolPaymentSignedTx(
  //       connection,
  //       wallet,
  //       program,
  //       request,
  //       true
  //     );

  //   const txId = await sendAndConfirm(singleSolPaymentTransactionSerialized);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const recipientBalance = await connection.getBalance(recipient.publicKey);
  //   console.log(
  //     'One time payment over SC tx: ',
  //     txId,
  //     'Recipient balance before:',
  //     recipientBalanceBefore,
  //     'Recipient balance: ',
  //     recipientBalance
  //   );
  //   assert.ok(
  //     recipientBalance === recipientBalanceBefore + 1e6 * (1 - baseFee)
  //   );
  // });

  // it('Splits onetime SOL payment - serialized', async () => {
  //   const request: SinglePaymentRequest = {
  //     amount: 1e6,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     mintAddress: mint,
  //     cluster: 'devnet',
  //   };

  //   const remainingAccounts = Array<PublicKey>();
  //   const remainingAmounts = Array<number>();
  //   for (let i = 0; i < 10; i++) {
  //     remainingAmounts.push(5e5);
  //     remainingAccounts.push(recipient.publicKey);
  //   }

  //   const recipientBalanceBefore = await connection.getBalance(
  //     recipient.publicKey
  //   );

  //   const singleSolPaymentTransactionSerialized =
  //     await getSingleSolPaymentSignedTx(
  //       connection,
  //       wallet,
  //       program,
  //       request,
  //       false,
  //       remainingAmounts,
  //       remainingAccounts
  //     );

  //   const txId = await sendAndConfirm(singleSolPaymentTransactionSerialized);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const recipientBalance = await connection.getBalance(recipient.publicKey);
  //   console.log(
  //     'One time payment over SC tx: ',
  //     txId,
  //     'Recipient before: ',
  //     recipientBalanceBefore,
  //     ' recipient balance: ',
  //     recipientBalance
  //   );
  //   assert.ok(recipientBalance === recipientBalanceBefore + 6e6);
  // });

  it('Gets create payment serialized transaction', async () => {
    paymentAccount = new Keypair();
    const startAt = Math.floor(new Date().getTime() / 1000) + 1;
    const endAt = startAt + 100;
    const request: CreatePaymentStateRequest = {
      amount: 100000,
      startAt,
      endAt,
      interval: 50,
      mintAddress: mint,
      sender: sender.publicKey,
      recipient: recipient.publicKey,
      paymentAccount,
    };

    const paymentTransaction = await getCreatePaymentSignedTx(
      connection,
      wallet,
      program,
      request,
      true
    );

    const txId = await sendAndConfirm(paymentTransaction);
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

  // it('Gets withdraw transaction', async () => {
  //   const request: WithdrawRequest = {
  //     recipient: recipient.publicKey,
  //     payment: paymentAccount.publicKey,
  //     mintAddress: mint,
  //   };

  //   //  Sign with recipient wallet
  //   let walletRecipient: Wallet = new Wallet(recipient);
  //   let provider = new anchor.AnchorProvider(
  //     connection,
  //     walletRecipient,
  //     txOpts
  //   );
  //   let program = new Program<HelioIdl>(IDL, PROGRAM_ID, provider);

  //   const withdrawTransaction = await getWithdrawSignedTx(
  //     connection,
  //     walletRecipient,
  //     program,
  //     request
  //   );
  //   const txId = await sendAndConfirm(withdrawTransaction);
  //   console.log('withdraw tx: ', txId);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   console.log(
  //     'rec tokens amount: ',
  //     Number(recipientTokenAccountLocal.amount)
  //   );
  //   assert.ok(
  //     Number(recipientTokenAccountLocal.amount) === 50000 * (1 - baseFee)
  //   );
  // });

  // it('Gets cancel payment transaction', async () => {
  //   await sleep(30 * 1000); // Wait 20 secs for devnet next block
  //   const request: CancelPaymentRequest = {
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     payment: paymentAccount.publicKey,
  //     mintAddress: mint,
  //   };

  //   const cancelTransaction = await getCancelPaymentSignedTx(
  //     connection,
  //     wallet,
  //     program,
  //     request
  //   );
  //   const txId = await sendAndConfirm(cancelTransaction);
  //   await sleep(20 * 1000); // Wait 10 secs for devnet to show real data
  //   console.log('cancel tx: ', txId);
  //   const senderTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     senderTokenAccount
  //   );
  //   console.log(
  //     'sender tokens amount: ',
  //     Number(senderTokenAccountLocal.amount)
  //   );
  //   assert.ok(Number(senderTokenAccountLocal.amount) === 900000);
  //   const recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   console.log(
  //     'rec tokens amount: ',
  //     Number(recipientTokenAccountLocal.amount)
  //   );
  //   assert.ok(
  //     Number(recipientTokenAccountLocal.amount) === 100000 * (1 - baseFee)
  //   );
  // });

  // it('Gets SOL payment create transaction', async () => {
  //   paymentAccount = new Keypair();
  //   const startAt = Math.floor(new Date().getTime() / 1000) + 1;
  //   const endAt = startAt + 200;
  //   const request: CreatePaymentStateRequest = {
  //     amount: 1e6,
  //     startAt,
  //     endAt,
  //     interval: 100,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     paymentAccount,
  //   };
  //   const senderBalanceBefore = await connection.getBalance(sender.publicKey);

  //   const paymentTransaction = await getCreateSolPaymentSignedTx(
  //     connection,
  //     wallet,
  //     program,
  //     request,
  //     false
  //   );

  //   const txId = await sendAndConfirm(paymentTransaction);
  //   console.log('Create sol tx: ', txId);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet

  //   const paymentAccountLocal: any =
  //     await program.account.solPaymentAccount.fetch(paymentAccount.publicKey);
  //   console.log('Escrow payment account: ', paymentAccountLocal);

  //   // Check that the values in the payment escrow account match what we expect.
  //   assert.ok(paymentAccountLocal.senderKey.equals(sender.publicKey));
  //   assert.ok(paymentAccountLocal.recipientKey.equals(recipient.publicKey));
  //   assert.ok(paymentAccountLocal.amount.toNumber() === 1e6);
  //   assert.ok(paymentAccountLocal.interval.toNumber() === 100);
  //   assert.ok(paymentAccountLocal.withdrawal.toNumber() === 0);
  //   assert.ok(paymentAccountLocal.payFees === false);
  //   // Check balance of payment account
  //   const paymentAccountBalance = await connection.getBalance(
  //     paymentAccount.publicKey
  //   );
  //   console.log('Payment bal', paymentAccountBalance); // amount + rent
  //   assert.ok(paymentAccountBalance > 1e6);
  //   const senderBalance = await connection.getBalance(sender.publicKey);
  //   paymentSOLBalance = paymentAccountLocal.amount.toNumber();
  //   assert.ok(senderBalanceBefore > senderBalance + 1e6); // sender balance = old balance - amount - tx fee - rent
  // }).timeout(40000);

  // it('Gets withdraw SOL transaction', async () => {
  //   let walletRecipient: Wallet = new Wallet(recipient);
  //   let provider = new anchor.AnchorProvider(
  //     connection,
  //     walletRecipient,
  //     txOpts
  //   );
  //   let program = new Program<HelioIdl>(IDL, PROGRAM_ID, provider);
  //   const request: WithdrawRequest = {
  //     recipient: recipient.publicKey,
  //     payment: paymentAccount.publicKey,
  //   };
  //   const recipientBalanceBefore = await connection.getBalance(
  //     recipient.publicKey
  //   );
  //   const withdrawTransaction = await getWithdrawSolSignedTx(
  //     connection,
  //     walletRecipient,
  //     program,
  //     request
  //   );

  //   const txId = await sendAndConfirm(withdrawTransaction);
  //   console.log('withdraw sol tx: ', txId);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const recipientBalance = await connection.getBalance(recipient.publicKey);
  //   console.log('rec balance: ', recipientBalance);
  //   assert.ok(
  //     recipientBalance < recipientBalanceBefore + 5e5 &&
  //       recipientBalance > recipientBalanceBefore + 4.5e5
  //   );
  // });

  // it('Gets cancel SOL payment transaction', async () => {
  //   const sendersBalanceBefore = await connection.getBalance(sender.publicKey);
  //   const request: CancelPaymentRequest = {
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     payment: paymentAccount.publicKey,
  //   };
  //   await sleep(15 * 1000);
  //   const cancelTransaction = await getCancelSolPaymentSignedTx(
  //     connection,
  //     wallet,
  //     program,
  //     request
  //   );

  //   const txId = await sendAndConfirm(cancelTransaction);
  //   console.log('cancel sol tx: ', txId);
  //   await sleep(20 * 1000);

  //   const sendersBalance = await connection.getBalance(sender.publicKey);
  //   console.log(
  //     'Senders balance before:',
  //     sendersBalanceBefore,
  //     'Senders balance: ',
  //     sendersBalance
  //   );
  //   assert.ok(sendersBalance >= sendersBalanceBefore + paymentSOLBalance / 2); // get back rent, half amount, deduct fees
  // });

  // it('Creates payment', async () => {
  //   paymentAccount = new Keypair();
  //   const startAt = Math.floor(new Date().getTime() / 1000) + 1;
  //   const endAt = startAt + 100;
  //   const request: CreatePaymentStateRequest = {
  //     amount: 100000,
  //     startAt,
  //     endAt,
  //     interval: 50,
  //     mintAddress: mint,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     paymentAccount,
  //   };

  //   const paymentTransaction = await createPayment(program, request, true);
  //   console.log('Create tx: ', paymentTransaction);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const paymentAccountLocal: any = await program.account.paymentAccount.fetch(
  //     paymentAccount.publicKey
  //   );

  //   // Check that the values in the payment escrow account match what we expect.
  //   assert.ok(paymentAccountLocal.senderKey.equals(provider.wallet.publicKey));
  //   assert.ok(paymentAccountLocal.senderTokens.equals(senderTokenAccount));
  //   assert.ok(paymentAccountLocal.recipientKey.equals(recipient.publicKey));
  //   assert.ok(
  //     paymentAccountLocal.recipientTokens.equals(recipientTokenAccount)
  //   );
  //   assert.ok(paymentAccountLocal.amount.toNumber() === 100000);
  //   assert.ok(paymentAccountLocal.interval.toNumber() === 50);
  //   assert.ok(paymentAccountLocal.payFees);
  // }).timeout(40000);

  // it('Withdraws', async () => {
  //   const request: WithdrawRequest = {
  //     recipient: recipient.publicKey,
  //     payment: paymentAccount.publicKey,
  //     mintAddress: mint,
  //   };

  //   //  Sign with recipient wallet
  //   let walletRecipient: Wallet = new Wallet(recipient);
  //   let provider = new anchor.AnchorProvider(
  //     connection,
  //     walletRecipient,
  //     txOpts
  //   );
  //   let program = new Program<HelioIdl>(IDL, PROGRAM_ID, provider);

  //   const withdrawTransaction = await withdraw(program, request);
  //   console.log('withdraw tx: ', withdrawTransaction);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   console.log(
  //     'rec tokens amount: ',
  //     Number(recipientTokenAccountLocal.amount)
  //   );
  //   assert.ok(
  //     Number(recipientTokenAccountLocal.amount) === 50000 * (1 - baseFee)
  //   );
  // });

  // it('Cancels payment', async () => {
  //   await sleep(30 * 1000); // Wait 20 secs for devnet next block
  //   const request: CancelPaymentRequest = {
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     payment: paymentAccount.publicKey,
  //     mintAddress: mint,
  //   };

  //   const cancelTransaction = await cancelPayment(program, request);
  //   await sleep(20 * 1000); // Wait 10 secs for devnet to show real data
  //   console.log('cancel tx: ', cancelTransaction);
  //   const senderTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     senderTokenAccount
  //   );
  //   console.log(
  //     'sender tokens amount: ',
  //     Number(senderTokenAccountLocal.amount)
  //   );
  //   assert.ok(Number(senderTokenAccountLocal.amount) === 900000);
  //   const recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   console.log(
  //     'rec tokens amount: ',
  //     Number(recipientTokenAccountLocal.amount)
  //   );
  //   assert.ok(
  //     Number(recipientTokenAccountLocal.amount) === 100000 * (1 - baseFee)
  //   );
  // });

  // it('Pays one time over smart contract', async () => {
  //   let recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   const initialAmount = Number(recipientTokenAccountLocal.amount);

  //   const request: SinglePaymentRequest = {
  //     amount: 10000,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     mintAddress: mint,
  //     cluster: 'devnet',
  //   };

  //   const singlePaymentTransaction = await singlePayment(program, request);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   const amount = Number(recipientTokenAccountLocal.amount);
  //   assert.ok(amount === initialAmount + 10000 * (1 - baseFee));
  //   console.log('One time payment over SC tx: ', singlePaymentTransaction);
  // });

  // it('Splits one time payment', async () => {
  //   let recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   const initialAmount = Number(recipientTokenAccountLocal.amount);

  //   const remainingAccounts = Array<PublicKey>();
  //   const remainingAmounts = Array<number>();
  //   for (let i = 0; i < 4; i++) {
  //     remainingAmounts.push(500);
  //     remainingAccounts.push(recipient.publicKey);
  //     remainingAccounts.push(recipientTokenAccount);
  //   }

  //   const request: SinglePaymentRequest = {
  //     amount: 1000,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     mintAddress: mint,
  //     cluster: 'devnet',
  //   };
  //   const singlePaymentTransaction = await singlePayment(
  //     program,
  //     request,
  //     false,
  //     remainingAmounts,
  //     remainingAccounts
  //   );

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   recipientTokenAccountLocal = await getAccount(
  //     provider.connection,
  //     recipientTokenAccount
  //   );
  //   const amount = Number(recipientTokenAccountLocal.amount);
  //   assert.ok(amount === initialAmount + 3000); // to same account
  //   console.log(
  //     'Split one time payment tx: ',
  //     singlePaymentTransaction,
  //     'initial amount: ',
  //     initialAmount,
  //     'final amount:',
  //     amount
  //   );
  // });

  // it('Creates SOL payment', async () => {
  //   paymentAccount = new Keypair();
  //   const startAt = Math.floor(new Date().getTime() / 1000) + 1;
  //   const endAt = startAt + 200;
  //   const request: CreatePaymentStateRequest = {
  //     amount: 1e6,
  //     startAt,
  //     endAt,
  //     interval: 100,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     paymentAccount,
  //   };
  //   const senderBalanceBefore = await connection.getBalance(sender.publicKey);

  //   const paymentTransaction = await createSolPayment(program, request, false);
  //   console.log('Create sol tx: ', paymentTransaction);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet

  //   const paymentAccountLocal: any =
  //     await program.account.solPaymentAccount.fetch(paymentAccount.publicKey);
  //   console.log('Escrow payment account: ', paymentAccountLocal);

  //   // Check that the values in the payment escrow account match what we expect.
  //   assert.ok(paymentAccountLocal.senderKey.equals(sender.publicKey));
  //   assert.ok(paymentAccountLocal.recipientKey.equals(recipient.publicKey));
  //   assert.ok(paymentAccountLocal.amount.toNumber() === 1e6);
  //   assert.ok(paymentAccountLocal.interval.toNumber() === 100);
  //   assert.ok(paymentAccountLocal.withdrawal.toNumber() === 0);
  //   assert.ok(paymentAccountLocal.payFees === false);
  //   // Check balance of payment account
  //   const paymentAccountBalance = await connection.getBalance(
  //     paymentAccount.publicKey
  //   );
  //   console.log('Payment bal', paymentAccountBalance); // amount + rent
  //   assert.ok(paymentAccountBalance > 1e6);
  //   const senderBalance = await connection.getBalance(sender.publicKey);
  //   paymentSOLBalance = paymentAccountLocal.amount.toNumber();
  //   assert.ok(senderBalanceBefore > senderBalance + 1e6); // sender balance = old balance - amount - tx fee - rent
  // }).timeout(40000);

  // it('Withdraws SOL', async () => {
  //   let walletRecipient: Wallet = new Wallet(recipient);
  //   let provider = new anchor.AnchorProvider(
  //     connection,
  //     walletRecipient,
  //     txOpts
  //   );
  //   let program = new Program<HelioIdl>(IDL, PROGRAM_ID, provider);
  //   const request: WithdrawRequest = {
  //     recipient: recipient.publicKey,
  //     payment: paymentAccount.publicKey,
  //   };
  //   const recipientBalanceBefore = await connection.getBalance(
  //     recipient.publicKey
  //   );
  //   const withdrawTransaction = await withdrawSol(program, request);
  //   console.log('withdraw sol tx: ', withdrawTransaction);

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const recipientBalance = await connection.getBalance(recipient.publicKey);
  //   console.log('rec balance: ', recipientBalance);
  //   assert.ok(
  //     recipientBalance < recipientBalanceBefore + 5e5 &&
  //       recipientBalance > recipientBalanceBefore + 4.5e5
  //   );
  // });

  // it('Cancels SOL payment', async () => {
  //   const sendersBalanceBefore = await connection.getBalance(sender.publicKey);
  //   const request: CancelPaymentRequest = {
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     payment: paymentAccount.publicKey,
  //   };
  //   await sleep(15 * 1000);
  //   const cancelTransaction = await cancelSolPayment(program, request);
  //   await sleep(20 * 1000);
  //   console.log('cancel sol tx: ', cancelTransaction);
  //   const sendersBalance = await connection.getBalance(sender.publicKey);
  //   console.log(
  //     'Senders balance before:',
  //     sendersBalanceBefore,
  //     'Senders balance: ',
  //     sendersBalance
  //   );
  //   assert.ok(sendersBalance >= sendersBalanceBefore + paymentSOLBalance / 2); // get back rent, half amount, deduct fees
  // });

  // it('Pays SOL one time over smart contract', async () => {
  //   const request: SinglePaymentRequest = {
  //     amount: 1e6,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     mintAddress: mint,
  //     cluster: 'devnet',
  //   };

  //   const recipientBalanceBefore = await connection.getBalance(
  //     recipient.publicKey
  //   );

  //   const singlePaymentTransaction = await singleSolPayment(
  //     program,
  //     request,
  //     true
  //   );

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const recipientBalance = await connection.getBalance(recipient.publicKey);
  //   console.log(
  //     'One time payment over SC tx: ',
  //     singlePaymentTransaction,
  //     'Recipient balance before:',
  //     recipientBalanceBefore,
  //     'Recipient balance: ',
  //     recipientBalance
  //   );
  //   assert.ok(
  //     recipientBalance === recipientBalanceBefore + 1e6 * (1 - baseFee)
  //   );
  // });

  // it('Splits onetime SOL payment', async () => {
  //   const request: SinglePaymentRequest = {
  //     amount: 1e6,
  //     sender: sender.publicKey,
  //     recipient: recipient.publicKey,
  //     mintAddress: mint,
  //     cluster: 'devnet',
  //   };

  //   const remainingAccounts = Array<PublicKey>();
  //   const remainingAmounts = Array<number>();
  //   for (let i = 0; i < 10; i++) {
  //     remainingAmounts.push(5e5);
  //     remainingAccounts.push(recipient.publicKey);
  //   }

  //   const recipientBalanceBefore = await connection.getBalance(
  //     recipient.publicKey
  //   );

  //   const singlePaymentTransaction = await singleSolPayment(
  //     program,
  //     request,
  //     false,
  //     remainingAmounts,
  //     remainingAccounts
  //   );

  //   await sleep(20 * 1000); // Wait 20 secs for devnet
  //   const recipientBalance = await connection.getBalance(recipient.publicKey);
  //   console.log(
  //     'Recipient before: ',
  //     recipientBalanceBefore,
  //     ' recipient balance: ',
  //     recipientBalance
  //   );
  //   assert.ok(recipientBalance === recipientBalanceBefore + 6e6);
  //   console.log('One time payment over SC tx: ', singlePaymentTransaction);
  // });
});

async function sendAndConfirm(serializedTx: string) {
  const txId = await connection.sendRawTransaction(
    Buffer.from(JSON.parse(serializedTx).data)
  );

  await connection.confirmTransaction(txId);
  return txId;
}
