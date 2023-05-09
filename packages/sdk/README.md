# Helio SDK

## Introduction

The Helio SDK is a packaged module to make integrating Helio and our components as easy and as quickly as possible into your front end web site or store so you can start accepting Helio web3 payments.

It wraps and enhances the Helio [API](https://api.hel.io/v1/docs) away into one NPM package which is easy to install and upgrade.

The Helio SDK is written in Typescript. 

Please use the latest production version. Only used ALPHA versions if advised to do so.

Solana is currently supported with Polygon and ETH following soon.


## Installation

`yarn add @heliofi/sdk`

After installing the SDK please import this into your project:

`import { Helio } from "@heliofi/sdk";`

## Helio SDK Services

Detailed below are the methods used via the SDK to interact with the Helio API

Please ensure you select the correct 'Cluster' or network during deployment.

### Properties table for the HelioSDK

| Methods                 | Params                         | Return                        | Description                                                                  |
|:------------------------|:-------------------------------|:------------------------------|:-----------------------------------------------------------------------------|
| constructor             | options?: { cluster: Cluster } | void                          | set properties,  **cluster available values:** devnet, mainnet-beta, testnet |
| setCluster              | cluster: Cluster               | void                          | set cluster available value                                                  |
| currencyService         | none                           | CurrencyService, never        | returns object CurrencyService                                               |
| apiService              | none                           | HelioApiConnector, never      | returns object HelioApiAdapter                                               |
| solExplorerService      | none                           | SolExplorerService, never     | returns object SolExplorerService                                            |
| tokenConversionService  | none                           | TokenConversionService, never | returns object TokenConversionService                                        |
| paylinkService          | none                           | PaylinkSubmitService, never   | returns object PaylinkSubmitService                                          |
| paystreamStartService   | none                           | PaystreamStartService, never  | returns object PaystreamStartService                                         |
| paystreamCancelService  | none                           | PaystreamCancelService, never | returns object PaystreamCancelService                                        |
| configService           | none                           | ConfigService, never          | returns object ConfigService                                                 |

```
 Cluster = "devnet" | "testnet" | "mainnet-beta";
```
<br>

## Methods

### Properties table for the CurrencyService

| Methods                | Params                 | Return               | Description                             |
|:-----------------------|:-----------------------|:---------------------|:----------------------------------------|
| getCurrencies          | none                   | Promise<Currency[]>  | if currencies are empty adds currencies |
| getCurrencyBySymbol    | symbol: string         | Currency, never      | get currency by symbol (e.g. "SOl")     |
| getCurrencyByMint      | mint: string           | Currency, never      | get currency by mint address            |

```
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

### Properties table for the HelioApiAdapter

| Methods                           | Params                                                                                                                                                   | Return                                 | Description                                          |
|:----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------|:-----------------------------------------------------|
| findAddress                       | query: string, country_code: string                                                                                                                      | Promise&lt;FetchifyFindAddress&gt;     | get addresses list by area code and country code     |
| retrieveAddress                   | address_id: string, country_code: string                                                                                                                 | Promise&lt;FetchifyRetrieveAddress&gt; | get address more info by address id and country code |
| getCurrencies                     | none                                                                                                                                                     | Promise<Currency[]>                    | get currencies list                                  |
| getPaymentRequestByIdPublic       | id: string, paymentType: PaymentRequestType                                                                                                              | Promise&lt;any&gt;                     | get payment data by req. id and payment type         |
| getTokenSwapMintAddresses         | mintAddress: string                                                                                                                                      | Promise<string[]>                      | get mint addresses list                              |
| getTokenSwapQuote                 | paymentRequestId: string, paymentRequestType: PaymentRequestType,<br> fromMint: string, quantity?: number,<br> normalizedPrice?: number, toMint?: string | Promise&lt;SwapRouteToken&gt;          | get route token for swap                             |
| getLivePrice                      | amount: number, to: string, from: string,<br> paymentRequestId?: string, paymentRequestType?: string                                                     | Promise&lt;TokenQuoting&gt;            | get converted data                                   |
| getPreparedTransactionMessage     | url: string, body: string                                                                                                                                | Promise&lt;PrepareTransaction&gt;      | prepare transaction to send                          |
| getPreparedTransactionSwapMessage | url: string, body: string                                                                                                                                | Promise&lt;PrepareSwapTransaction&gt;  | prepare transaction to send for swap case            |

```
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

### Properties table for the SolExplorerService

| Methods                          | Params                 | Return  | Description                       |
|:---------------------------------|:-----------------------|:--------|:----------------------------------|
| getSolanaExplorerTransactionURL  | transactionID: string  | string  | get transaction URL by after pay  |

<br>

### Properties table for the TokenConversionService

| Methods                     | Params                                       | Return  | Description                            |
|:----------------------------|:---------------------------------------------|:--------|:---------------------------------------|
| convertFromMinimalUnits     | symbol: any, minimalAmount: bigint           | number  | convert from minimal amount            |
| convertToMinimalUnits       | symbol?: any actualAmount?: number           | number  | convert to minimal amount              |
| formatPrice                 | currency: Currency, normalizedAmount: number | string  | format price                           |
| convertFromMinimalAndRound  | symbol: string, minimalAmount: bigint        | string  | convert from minimal amount and round  |

```
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

### Properties table for the PaylinkSubmitService

| Methods            | Params                                              | Return               | Description                                              |
|:-------------------|:----------------------------------------------------|:---------------------|:---------------------------------------------------------|
| handleTransaction  | props: BasePaymentProps&lt;BasePaymentResponse&gt;  | Promise&lt;void&gt;  | prepare transaction, connect to wallet, send transaction |

```Typescript
  import { Idl, Program } from "@project-serum/anchor";
  import { AnchorWallet } from "@solana/wallet-adapter-react";
  import { Cluster, Connection } from "@solana/web3.js";
  import { HelioIdl } from '@heliofi/solana-adapter';

  TransactionStatus: {
      INITIATED = "INITIATED",
      PENDING = "PENDING",
      SUCCESS = "SUCCESS",
      FAILED = "FAILED",
      CANCELED = "CANCELED",
      SETTLED = "SETTLED"
  };
    
  ContentResponse: {
      text?: string;
      mediaUrl?: string;
      mediaAttachmentId?: string;
  };

  ApproveTransactionResponse: {
      transactionSignature: string;
      swapTransactionSignature?: string;
      content: ContentResponse;
      status?: TransactionStatus;
      statusToken?: string;
  };
  
  BasePaymentProps: {
    onSuccess: (event: {
      data: ApproveTransactionResponse;
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

### Properties table for the PaystreamStartService

| Methods            | Params                                              | Return               | Description                                                         |
|:-------------------|:----------------------------------------------------|:---------------------|:--------------------------------------------------------------------|
| handleTransaction  | props: BasePaymentProps&lt;BasePaymentResponse&gt;  | Promise&lt;void&gt;  | prepare transaction, connect to wallet, send pay stream transaction |

```Typescript
  import { Idl, Program } from "@project-serum/anchor";
  import { AnchorWallet } from "@solana/wallet-adapter-react";
  import { Cluster, Connection } from "@solana/web3.js";
  import { HelioIdl } from '@heliofi/solana-adapter';

  TransactionStatus: {
      INITIATED = "INITIATED",
      PENDING = "PENDING",
      SUCCESS = "SUCCESS",
      FAILED = "FAILED",
      CANCELED = "CANCELED",
      SETTLED = "SETTLED"
  };

  ContentResponse: {
      text?: string;
      mediaUrl?: string;
      mediaAttachmentId?: string;
  };

  CreatePaystreamResponse: {
      document: {
          id: string;
          startedAt: bigint;
          endedAt: bigint;
      };
      content: ContentResponse;
      transactionSignature: string;
      status?: TransactionStatus;
      statusToken?: string;
      swapTransactionSignature?: string;
  };
  
  BasePaymentProps: {
    onSuccess: (event: {
      data: CreatePaystreamResponse;
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

### Properties table for the PaystreamCancelService

| Methods            | Params                                              | Return               | Description                                                                     |
|:-------------------|:----------------------------------------------------|:---------------------|:--------------------------------------------------------------------------------|
| handleTransaction  | props: BasePaymentProps&lt;BasePaymentResponse&gt;  | Promise&lt;void&gt;  | prepare transaction, connect to wallet, send pay stream for cancel transaction  |

```Typescript
  import { Idl, Program } from "@project-serum/anchor";
  import { AnchorWallet } from "@solana/wallet-adapter-react";
  import { Cluster, Connection } from "@solana/web3.js";
  import { HelioIdl } from '@heliofi/solana-adapter';

  TransactionStatus: {
    INITIATED = "INITIATED",
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    CANCELED = "CANCELED",
    SETTLED = "SETTLED"
  };

  ContentResponse: {
    text?: string;
    mediaUrl?: string;
    mediaAttachmentId?: string;
  };

  CancelStreamResponse: {
    content: ContentResponse;
    transactionSignature: string;
    status?: TransactionStatus;
    statusToken?: string;
    swapTransactionSignature?: string;
  };

  BasePaymentProps: {
    onSuccess: (event: {
        data: CancelStreamResponse;
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

### Properties table for the ConfigService

| Methods            | Params                                       | Return  | Description                                |
|:-------------------|:---------------------------------------------|:--------|:-------------------------------------------|
| getAssetUrl        | none                                         | string  | get helio assets url                       |
| getCluster         | none                                         | Cluster | return selected cluster                    |
| setCluster         | cluster: Cluster                             | void    | set cluster                                |
| getHelioApiBaseUrl | none                                         | string  | get Helio api base url for current cluster |
| getPhantomLink     | id: string, paymentType: PaymentRequestType  | string  | get payment url for phantom app            |

```Typescript
 Cluster = "devnet" | "testnet" | "mainnet-beta";

PaymentRequestType = "PAYLINK" | "PAYSTREAM" | "INVOICE";
```

## Example

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
