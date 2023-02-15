import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber, Contract, Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { JsonRpcProvider, Log } from '@ethersproject/providers';
import {
  getContractAddress,
  getEthPaymentTx,
  getPaymentTx,
  getSplitEthPaymentTx,
  getSplitPaymentTx,
  PaymentRequest,
  RecipientAndAmount,
} from '../src';
import { helio as helioAbi } from '../src/abi';
import { erc20Mock as erc20MockAbi } from './abi/erc20Mock';
import { LogDescription } from '@ethersproject/abi';

describe('Helio protocol', function () {
  let erc20: Contract,
    provider: JsonRpcProvider,
    sender: SignerWithAddress,
    recipient: SignerWithAddress,
    feeAccount = ethers.utils.getAddress(
      '0x56C4f0504f577a283073AB780b6850feC4121389'
    ),
    helio: Contract,
    splitRecipients: Array<SignerWithAddress>,
    baseAmount: BigNumber = ethers.utils.parseUnits('0.002', 'ether'),
    defaultBalance: BigNumber,
    wallet: Wallet,
    fee = 0;

  const erc20MockAddress = '0x0555160ABe1A68880A1CD1446Ab301c098C8A7ca';

  describe('Deploy and prepare', function () {
    it('Should deploy and approve funds', async function () {
      provider = ethers.provider;
      const contractAddress =
        getContractAddress((await provider.getNetwork()).chainId) ||
        'no address';
      helio = new Contract(contractAddress, helioAbi.abi, provider);
      // Returns only one signer on Mumbai
      const signers = await ethers.getSigners();
      sender = signers[0];
      defaultBalance = await sender.getBalance();
      recipient = (await ethers.getSigners())[0]; // it gets you same as recipient
      // recipient address:  0x09E4bAe0BaB93A91B19Bc1e4d7741bc31298019E , wallet gets recreated
      console.log(
        'Sender address:',
        sender.address,
        '\nRecipient address: ',
        recipient.address
      );
      splitRecipients = [recipient, recipient, recipient, recipient];
      erc20 = new Contract(erc20MockAddress, erc20MockAbi.abi, sender);
      console.log('chain: ', provider.network.chainId);
      wallet = await prepareWallet();
      console.log('First (dummy) nonce: ', await wallet.getTransactionCount());
      try {
        const tx = await wallet.sendTransaction({
          from: wallet.address,
          to: wallet.address,
          value: ethers.utils.parseEther('0.00001'),
          nonce: await wallet.getTransactionCount(),
          gasLimit: ethers.utils.hexlify('0x100000'),
          gasPrice: await provider.getGasPrice(),
        });
        await tx.wait();
        console.log('Here');
      } catch (e) {}
    });

    async function prepareWallet(): Promise<Wallet> {
      console.log(
        'sender balance:',
        await provider.getBalance(sender.address),
        'needed balance: ',
        ethers.utils.parseEther('0.01')
      );
      const wallet = Wallet.createRandom().connect(provider);
      let tx = await sender.sendTransaction({
        from: sender.address,
        to: wallet.address,
        value: ethers.utils.parseEther('0.01'),
        nonce: await provider.getTransactionCount(sender.address, 'latest'),
        gasLimit: ethers.utils.hexlify('0x100000'),
        gasPrice: await provider.getGasPrice(),
      });
      await tx.wait();
      const amount = baseAmount.mul(10);
      await erc20.mint(wallet.address, amount);
      await erc20.connect(wallet).approve(helio.address, amount, {
        from: wallet.address,
      });
      sleep(15 * 1000);
      console.log(
        'Wallet address: ',
        wallet.address,
        ' sender address: ',
        sender.address
      );
      console.log(
        'Wallet ETH balance: ',
        await wallet.getBalance(),
        ' Wallet ERC balance: ',
        await erc20.balanceOf(wallet.address)
      );
      return wallet;
    }
  });

  describe('ERC payments', function () {
    it('Should get serialized transaction and pay in the ERC20', async function () {
      sleep(120 * 1000);
      console.log('Nonce: ', await wallet.getTransactionCount());
      const recipientBalanceBefore = await erc20.balanceOf(recipient.address);
      const amount = baseAmount;
      const transferAmount = amount.div(2);
      const req: PaymentRequest = {
        walletAddress: wallet.address,
        recipientAddress: recipient.address,
        amount: transferAmount.toBigInt(),
        fee,
        transactonDbId: 'Erc2oTxId',
        tokenAddres: erc20.address,
      };

      const serializedTx = await getPaymentTx(provider, req);
      const signedTx = await wallet.signTransaction(serializedTx);
      const tx = await provider.sendTransaction(signedTx);
      const receipt = await tx.wait();
      console.log(parseLogs(receipt.logs, helio));
      console.log('tx hash', tx.hash);

      sleep(15 * 1000);

      // await expect(provider.sendTransaction(signedTx)).to.emit(
      //   helio,
      //   'Payment'
      // );
      const recipientBalance = await erc20.balanceOf(recipient.address);
      console.log(
        'recipientBalance before: ',
        recipientBalanceBefore,
        'recipientBalance: ',
        recipientBalance
      );
      expect(recipientBalance).to.be.equal(
        recipientBalanceBefore.add(transferAmount)
      );
    });

    it('Should get serialized transaction and split pay in the ERC20', async function () {
      sleep(240 * 1000);
      console.log('Nonce: ', await wallet.getTransactionCount());
      const recipientBalanceBefore = await erc20.balanceOf(recipient.address);
      const amount = baseAmount;
      const transferAmount = amount.div(2);

      const req: PaymentRequest = {
        walletAddress: wallet.address,
        recipientAddress: recipient.address,
        amount: transferAmount.toBigInt(),
        fee,
        transactonDbId: 'SplitErc20TxId',
        tokenAddres: erc20.address,
      };

      const serializedTx = await getSplitPaymentTx(
        provider,
        req,
        createSplitPaymentsList(splitRecipients, transferAmount)
      );
      const signedTx = await wallet.signTransaction(serializedTx);

      await expect(provider.sendTransaction(signedTx)).to.emit(
        helio,
        'SplitPayment'
      );
      const recipientBalance = await erc20.balanceOf(recipient.address);
      console.log(
        'recipientBalance before: ',
        recipientBalanceBefore,
        'recipientBalance: ',
        recipientBalance
      );
      expect(recipientBalance).to.be.equal(
        recipientBalanceBefore.add(
          transferAmount.mul(splitRecipients.length + 1)
        )
      );
    });
  });

  describe('ETH payments', function () {
    it('Should get serialized transaction and pay in the eth', async function () {
      sleep(90 * 1000);
      console.log('Nonce: ', await wallet.getTransactionCount());
      const recipientBalanceBefore = await provider.getBalance(
        recipient.address
      );
      const amount = baseAmount;
      const transferAmount = amount.div(20);
      const req: PaymentRequest = {
        walletAddress: wallet.address,
        recipientAddress: recipient.address,
        amount: transferAmount.toBigInt(),
        fee,
        transactonDbId: 'EthTxId',
      };
      const serializedTx = await getEthPaymentTx(provider, req);
      const signedTx = await wallet.signTransaction(serializedTx);
      const tx = await provider.sendTransaction(signedTx);
      const receipt = await tx.wait();
      console.log('tx hash', tx.hash);
      console.log(parseLogs(receipt.logs, helio));

      sleep(15 * 1000);
      const recipientBalance = await provider.getBalance(recipient.address);
      console.log(
        'recipientBalance before: ',
        recipientBalanceBefore,
        'recipientBalance: ',
        recipientBalance
      );
      expect(recipientBalance).to.be.equal(
        recipientBalanceBefore.add(transferAmount)
      );
    });

    it('Should get serialized transaction and split pay in the eth', async function () {
      sleep(120 * 1000);
      console.log('Nonce: ', await wallet.getTransactionCount());
      const recipientBalanceBefore = await provider.getBalance(
        recipient.address
      );
      const amount = baseAmount.div(20);
      const transferAmount = amount;
      const req: PaymentRequest = {
        walletAddress: wallet.address,
        recipientAddress: recipient.address,
        amount: transferAmount.toBigInt(),
        fee,
        transactonDbId: 'SplitEthTxId',
      };
      const serializedTx = await getSplitEthPaymentTx(
        provider,
        req,
        createSplitPaymentsList(splitRecipients, amount)
      );
      const signedTx = await wallet.signTransaction(serializedTx);
      const tx = await provider.sendTransaction(signedTx);
      await tx.wait();
      console.log('tx hash', tx.hash);
      const recipientBalance = await provider.getBalance(recipient.address);
      console.log(
        'recipientBalance before: ',
        recipientBalanceBefore,
        'recipientBalance: ',
        recipientBalance
      );
      expect(recipientBalance).to.be.equal(
        recipientBalanceBefore.add(
          transferAmount.mul(splitRecipients.length + 1)
        )
      );
    });
  });
});

async function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function createSplitPaymentsList(
  recipients: SignerWithAddress[],
  amount: BigNumber
): Array<RecipientAndAmount> {
  const recipientsAndAmounts: RecipientAndAmount[] = [];
  for (const recipient of recipients) {
    recipientsAndAmounts.push({ recipient: recipient.address, amount });
  }
  return recipientsAndAmounts;
}

function parseLogs(logs: Log[], helio: Contract): LogDescription[] {
  const res: LogDescription[] = [];
  for (const log of logs) {
    try {
      res.push(helio.interface.parseLog(log));
    } catch (e) {}
  }
  return res;
}
