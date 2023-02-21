# Helio SDK

## Introduction

The Helio SDK is easiest way to integrate Helio payments into your site or project.

The functionality provided in the SDK wraps and enhances the core Helio [REST APIs](https://docs.hel.io/developers/detailed-api-schema) into one NPM package which is easy to install and upgrade.


## Installation

`yarn add @heliofi/sdk`

`npm install helio-sdk`

After installing the SDK please import it into your project:

```Typescript
import { Helio } from "helio-sdk";

const helioAPI = new Helio("<your-api-key-here>"); // input your api key generated from hel.io here
```

<b>Obtaining API Keys</b>

Generate API Keys at hel.io | settings | API and enter the required keys as per the example above

Store your public and secret API keys in a safe place. You will not be able to copy the secret API key after creation


## Using the Helio SDK

The Helio SDK consolidates all the required API endpoints and services into one easy to use NPM package

See below for a list of services, methods and associated properties:

### Helio SDK Properties table:


| Methods                | Params                         | Return                        | Description                                                                  |
|:-----------------------|:-------------------------------|:------------------------------|:-----------------------------------------------------------------------------|
| constructor            | options?: { cluster: Cluster } | void                          | set properties,  **cluster available values:** devnet, mainnet-beta, testnet |
| setCluster             | cluster: Cluster               | void                          | set cluster available value                                                  |
| currencyService        | none                           | CurrencyService, never        | returns object CurrencyService                                               |
| apiService             | none                           | HelioApiConnector, never      | returns object HelioApiAdapter                                               |
| solExplorerService     | none                           | SolExplorerService, never     | returns object SolExplorerService                                            |
| tokenConversionService | none                           | TokenConversionService, never | returns object TokenConversionService                                        |
| paylinkService         | none                           | PaylinkSubmitService, never   | returns object PaylinkSubmitService                                          |
| configService          | none                           | ConfigService, never          | returns object ConfigService                                                 |

Select the required blockchain type by selecting one of the options below:

```Typescript
Cluster = "devnet" | "testnet" | "mainnet-beta";
```
<br>

### CurrencyService Properties

| Methods                | Params                 | Return               | Description                             |
|:-----------------------|:-----------------------|:---------------------|:----------------------------------------|
| getCurrencies          | none                   | Promise<Currency[]>  | if currencies are empty adds currencies |
| getCurrencyBySymbol    | symbol: string         | Currency, never      | get currency by symbol (e.g. "SOl")     |
| getCurrencyByMint      | mint: string           | Currency, never      | get currency by mint address            |

```Typescript
Currency: {
  blockchain: {
    engine: {
      id: string;
      type: "EVM" | "SOL";
    };
  };
  id: string;
  symbol: string;
  name: string;
  mintAddress?: string;
  coinMarketCapId: number;
  decimals: number;
  symbolPrefix?: string;
  order: number;
  type?: "FIAT" | "DIGITAL";
  iconUrl?: string;
};
```
<br>

### HelioApiAdapter Properties

| Methods                            | Params                                                                                                                                                   | Return                                 | Description                                          |
|:-----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------|:-----------------------------------------------------|
| findAddress                        | query: string, country_code: string                                                                                                                      | Promise&lt;FetchifyFindAddress&gt;     | get addresses list by area code and country code     |
| retrieveAddress                    | address_id: string, country_code: string                                                                                                                 | Promise&lt;FetchifyRetrieveAddress&gt; | get address more info by address id and country code |
| listCurrencies                     | none                                                                                                                                                     | Promise<Currency[]>                    | get currencies list                                  |
| getPaymentRequestByIdPublic        | id: string                                                                                                                                               | Promise&lt;any&gt;                     | get paylink info                                     |
| getTokenSwapMintAddresses          | mintAddress: string                                                                                                                                      | Promise<string[]>                      | get mint addresses list                              |
| getTokenSwapQuote                  | paymentRequestId: string, paymentRequestType: PaymentRequestType,<br> fromMint: string, quantity?: number,<br> normalizedPrice?: number, toMint?: string | Promise&lt;SwapRouteToken&gt;          | get route token for swap                             |
| getLivePrice                       | amount: number, to: string, from: string,<br> paymentRequestId?: string, paymentRequestType?: string                                                     | Promise&lt;TokenQuoting&gt;            | get converted data                                   |
| getPreparedTransactionMessage      | url: string, body: string                                                                                                                                | Promise&lt;PrepareTransaction&gt;      | prepare transaction to send                          |
| getPreparedTransactionSwapMessage  | url: string, body: string                                                                                                                                | Promise&lt;PrepareSwapTransaction&gt;  | prepare transaction to send for swap case            |

```Typescript
FetchifyFindAddress: {
  results: {
    id: string;
    count: number;
    labels: string[];
  }[];
};

FetchifyRetrieveAddress: {
  result: {
    province_name: string;
    street_name: string;
    street_prefix: string;
    street_suffix: string;
    building_number: string;
    line_2: string;
    province: string;
    locality: string;
  };
};
  
Currency: {
  blockchain: {
    engine: {
      id: string;
      type: "EVM" | "SOL";
    };
  };
  id: string;
  symbol: string;
  name: string;
  mintAddress?: string;
  coinMarketCapId: number;
  decimals: number;
  symbolPrefix?: string;
  order: number;
  type?: "FIAT" | "DIGITAL";
  iconUrl?: string;
};

PaymentRequestType = "PAYLINK" | "PAYSTREAM" | "INVOICE";

SwapRouteToken: {
  routeToken: string;
};

TokenQuoting: {
  rateToken: string;
};

PrepareTransaction: {
  transactionToken: string;
  transactionMessage: string;
};

PrepareSwapTransaction: {
  standardTransaction: PrepareTransaction;
  swapTransaction: string;
};
```
<br>

### SolExplorerService Properties

| Methods                          | Params                 | Return  | Description                       |
|:---------------------------------|:-----------------------|:--------|:----------------------------------|
| getSolanaExplorerTransactionURL  | transactionID: string  | string  | get transaction URL by after pay  |

<br>

### TokenConversionService Properties

| Methods                     | Params                                       | Return  | Description                            |
|:----------------------------|:---------------------------------------------|:--------|:---------------------------------------|
| convertFromMinimalUnits     | symbol: any, minimalAmount: number           | number  | convert from minimal amount            |
| convertToMinimalUnits       | symbol?: any actualAmount?: number           | number  | convert to minimal amount              |
| formatPrice                 | currency: Currency, normalizedAmount: number | string  | format price                           |
| convertFromMinimalAndRound  | symbol: string, minimalAmount: number        | string  | convert from minimal amount and round  |

```Typescript
  Currency: {
    blockchain: {
      engine: {
        id: string;
        type: "EVM" | "SOL";
      };
    };
    id: string;
    symbol: string;
    name: string;
    mintAddress?: string;
    coinMarketCapId: number;
    decimals: number;
    symbolPrefix?: string;
    order: number;
    type?: "FIAT" | "DIGITAL";
    iconUrl?: string;
  };
```
<br>

### PaylinkSubmitService Properties

| Methods            | Params                                              | Return               | Description                                              |
|:-------------------|:----------------------------------------------------|:---------------------|:---------------------------------------------------------|
| handleTransaction  | props: BasePaymentProps&lt;BasePaymentResponse&gt;  | Promise&lt;void&gt;  | prepare transaction, connect to wallet, send transaction |

```Typescript
import { Idl, Program } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Cluster, Connection } from "@solana/web3.js";

BasePaymentResponse: {
    transactionSignature: string;
    swapTransactionSignature?: string;
};

BasePaymentProps: {
  onSuccess: (event: {
    data: BasePaymentResponse;
    transaction: string;
    paymentPK?: string;
    swapTransaction?: string;
  }) => void;
  onError: (event: { transaction?: string; errorMessage: string }) => void;
  onPending?: (event: { transaction: string }) => void;
  symbol: string;
  anchorProvider: Program<HelioIdl>;
  wallet: AnchorWallet;
  connection: Connection;
  rateToken?: string;
  cluster: Cluster;
};
  
```
<br>

### ConfigService Properties

| Methods             | Params           | Return  | Description                                |
|:--------------------|:-----------------|:--------|:-------------------------------------------|
| getAssetUrl         | none             | string  | get helio assets url                       |
| getCluster          | none             | Cluster | return selected cluster                    |
| setCluster          | cluster: Cluster | void    | set cluster                                |
| getHelioApiBaseUrl  | none             | string  | get Helio api base url for current cluster |

```Typescript
Cluster = "devnet" | "testnet" | "mainnet-beta";
```

## Example Helio SDK commands

```Typescript
import { HelioSDK, ClusterType } from '@heliofi/sdk';
import { Cluster } from '@solana/web3.js';

const cluster = ClusterType.Devnet;

//create object HelioSDK
const helioSDK = new HelioSDK({ cluster });

//get curriences
const currencies = helioSDK.currencyService.getCurrencies();

//get helio asset url
const url = helioSDK.configService.getAssetUrl();

//get mint addresses list
const mintAddresses = await helioSDK.apiService.getTokenSwapMintAddresses('mint address');

//get transaction url
const transactionUrl = helioSDK.solExplorerService.getSolanaExplorerTransactionURL('transaction');

//convert to minimal amount
const amount = helioSDK.tokenConversionService.convertToMinimalUnits('symbol', 100);

//handle transaction
await helioSDK.paylinkService.handleTransaction({...});
```
