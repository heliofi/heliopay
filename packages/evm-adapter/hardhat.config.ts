/* eslint-disable import/no-extraneous-dependencies */
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  defaultNetwork: 'matic',
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: '10000000000000000000000',
      },
      chainId: 7545,
    },
    matic: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [String(process.env.PRIVATE_KEY)],
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  paths: {
    sources: './contracts',
  },
};

export default config;
