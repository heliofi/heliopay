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

| Methods                        | Params                                                        | Return                                 | Description                                                             |
|:-------------------------------|:--------------------------------------------------------------|:---------------------------------------|:------------------------------------------------------------------------|
| constructor                    | options?: { cluster: ClusterHelioType; customApiUrl: string } | void                                   | set properties,  **cluster available values:** devnet, mainnet, testnet |
| setCluster                     | cluster: ClusterHelioType                                     | void                                   | set cluster available value                                             |
| setCustomApiUrl                | customApiUrl: string                                          | void                                   | set custom api url                                                      |
| currencyService                | none                                                          | CurrencyService, never                 | returns object CurrencyService                                          |
| defaultCurrencyService         | none                                                          | DefaultCurrencyService, never          | returns object DefaultCurrencyService                                   |
| apiService                     | none                                                          | HelioApiConnector, never               | returns object HelioApiAdapter                                          |
| solExplorerService             | none                                                          | SolExplorerService, never              | returns object SolExplorerService                                       |
| polygonExplorerService         | none                                                          | PolygonExplorerService, never          | returns object PolygonExplorerService                                   |
| ethExplorerService             | none                                                          | EthereumExplorerService, never         | returns object EthereumExplorerService                                  |
| tokenConversionService         | none                                                          | TokenConversionService, never          | returns object TokenConversionService                                   |
| paylinkService                 | none                                                          | PaylinkSubmitService, never            | returns object PaylinkSubmitService                                     |
| polygonPaylinkService          | none                                                          | PolygonPaylinkSubmitService, never     | returns object PolygonPaylinkSubmitService                              |
| ethPaylinkService              | none                                                          | EthPaylinkSubmitService, never         | returns object EthPaylinkSubmitService                                  |
| paystreamStartService          | none                                                          | PaystreamStartService, never           | returns object PaystreamStartService                                    |
| paystreamCancelService         | none                                                          | PaystreamCancelService, never          | returns object PaystreamCancelService                                   |
| configService                  | none                                                          | ConfigService, never                   | returns object ConfigService                                            |
| solAvailableBalanceService     | none                                                          | SolAvailableBalanceService, never      | returns object SolAvailableBalanceService                               |
| ethAvailableBalanceService     | none                                                          | EthereumAvailableBalanceService, never | returns object EthereumAvailableBalanceService                          |
| polygonAvailableBalanceService | none                                                          | PolygonAvailableBalanceService, never  | returns object PolygonAvailableBalanceService                           |
| availableBalanceService        | none                                                          | AvailableBalanceService, never         | returns object AvailableBalanceService                                  |

```Typescript
type ClusterHelioType = 'devnet' | 'testnet' | 'mainnet';

```
<br>

## Methods

### Properties table for the CurrencyService

| Methods                           | Params                                                  | Return                     | Description                             |
|:----------------------------------|:--------------------------------------------------------|:---------------------------|:----------------------------------------|
| getCurrencies                     | none                                                    | Promise<Currency[]>        | if currencies are empty adds currencies |
| getCurrencyBySymbol               | symbol: string                                          | Currency, undefined, never | get currency by symbol (e.g. "SOl")     |
| getCurrencyByMint                 | mint: string                                            | Currency, never            | get currency by mint address            |
| getCurrencyByMintOptional         | mint: string                                            | Currency, undefined        | get currency by mint address            |
| getCurrencyBySymbolAndBlockchain  | { symbol: string; blockchain?: BlockchainSymbol; }      | Currency, undefined, never | get currency by symbol and blockchain   |
| getCurrenciesByTypeAndBlockchain  | { type: CurrencyType; blockchain?: BlockchainSymbol; }  | Currency[]                 | get currency by type and blockchain     |

```Typescript
import { BlockchainSymbol, Currency, CurrencyType } from '@heliofi/common';
```
<br>

### Properties table for the DefaultCurrencyService

| Methods                               | Params             | Return            | Description                       |
|:--------------------------------------|:-------------------|:------------------|:----------------------------------|
| getNativeCurrencyByBlockchainToSymbol | blockchain: string | string, undefined | get native currency by blockchain |
| getSolCurrencySymbol                  | none               | string            | get sol native currency           |
| getMaticCurrencySymbol                | none               | string            | get matic native currency         |
| getEthCurrencySymbol                  | none               | string            | get eth native currency           |
| getDefaultCurrencySymbol              | none               | string            | get usdc native currency          |

<br>

### Properties table for the SolAvailableBalanceService

| Methods              | Params                                        | Return                              | Description                 |
|:---------------------|:----------------------------------------------|:------------------------------------|:----------------------------|
| getAvailableBalance  | publicKey: PublicKey, connection: Connection  | Promise&lt;AvailableBalance[]&gt;   | get available balance list  |

```Typescript
import { Connection, PublicKey } from '@solana/web3.js';

interface AvailableBalance {
    tokenSymbol: string;
    value: number;
}
```
<br>

### Properties table for the EthereumAvailableBalanceService

| Methods              | Params                   | Return                            | Description                 |
|:---------------------|:-------------------------|:----------------------------------|:----------------------------|
| getAvailableBalance  | publicKey: EVMPublicKey  | Promise&lt;AvailableBalance[]&gt; | get available balance list  |

```Typescript
type EVMPublicKey = `0x${string}`;

interface AvailableBalance {
    tokenSymbol: string;
    value: number;
}
```
<br>

### Properties table for the PolygonAvailableBalanceService

| Methods              | Params                   | Return                            | Description                 |
|:---------------------|:-------------------------|:----------------------------------|:----------------------------|
| getAvailableBalance  | publicKey: EVMPublicKey  | Promise&lt;AvailableBalance[]&gt; | get available balance list  |

```Typescript
type EVMPublicKey = `0x${string}`;

interface AvailableBalance {
    tokenSymbol: string;
    value: number;
}
```
<br>

### Properties table for the AvailableBalanceService

| Methods               | Params                                                                  | Return                | Description            |
|:----------------------|:------------------------------------------------------------------------|:----------------------|:-----------------------|
| fetchAvailableBalance | { props: AvailableBalanceServiceProps }                                 | Promise&lt;number&gt; | get available balance  |
| isBalanceEnough       | { isTokenSwapped: boolean; quantity?: number; decimalAmount: number; }  | boolean               | get is balance enough  |

```Typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { BlockchainSymbol, Currency } from '@heliofi/common';

type EVMPublicKey = `0x${string}`;

interface TokenSwapQuote {
    paymentRequestId: string;
    routeTokenString: string;
    from: Currency;
    to: Currency;
    slippageBps: number;
    priceImpactPct: number;
    inAmount: number;
    outAmount: number;
    amount: number;
}

interface AvailableBalanceServiceProps {
    publicKey?: PublicKey;
    connection?: Connection;
    evmPublicKey?: EVMPublicKey;
    decimalAmount: number;
    currency?: string;
    canSwapTokens?: boolean;
    swapCurrency?: string;
    quantity?: number;
    tokenSwapQuote?: TokenSwapQuote;
    blockchain?: BlockchainSymbol;
    areCurrenciesDefined: boolean;
}
```

<br>

### Properties table for the EthereumExplorerService

| Methods                           | Params                | Return  | Description                           |
|:----------------------------------|:----------------------|:--------|:--------------------------------------|
| getEthereumExplorerUrlByCluster   | none                  | string  | get ethereum url                      |
| getEthereumExplorerTransactionURL | transactionID: string | string  | get ethereum explorer transaction url |
| getEthereumExplorerAddressURL     | address: string       | string  | get ethereum explorer address url     |

<br>

### Properties table for the PolygonExplorerService

| Methods                          | Params                | Return  | Description                          |
|:---------------------------------|:----------------------|:--------|:-------------------------------------|
| getPolygonExplorerUrlByCluster   | none                  | string  | get polygon url                      |
| getPolygonExplorerTransactionURL | transactionID: string | string  | get polygon explorer transaction url |
| getPolygonExplorerAddressURL     | address: string       | string  | get polygon explorer address url     |

<br>

### Properties table for the HelioApiAdapter

| Methods                           | Params                                                                                                                                                   | Return                                          | Description                                          |
|:----------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------|:-----------------------------------------------------|
| findAddress                       | query: string, country_code: string                                                                                                                      | Promise&lt;FetchifyFindAddress&gt;              | get addresses list by area code and country code     |
| retrieveAddress                   | address_id: string, country_code: string                                                                                                                 | Promise&lt;FetchifyRetrieveAddress&gt;          | get address more info by address id and country code |
| getCurrencies                     | none                                                                                                                                                     | Promise<Currency[]>                             | get currencies list                                  |
| getPaymentRequestByIdPublic       | id: string, paymentType: PaymentRequestType                                                                                                              | Promise&lt;PaymentRequest&gt;                   | get payment data by req. id and payment type         |
| getTokenSwapMintAddresses         | mintAddress: string                                                                                                                                      | Promise<string[]>                               | get mint addresses list                              |
| getTokenSwapQuote                 | paymentRequestId: string, paymentRequestType: PaymentRequestType,<br> fromMint: string, quantity?: number,<br> normalizedPrice?: number, toMint?: string | Promise&lt;SwapRouteToken&gt;                   | get route token for swap                             |
| getLivePrice                      | amount: number, to: string, from: string,<br> paymentRequestId?: string, paymentRequestType?: string                                                     | Promise&lt;TokenQuoting&gt;                     | get converted data                                   |
| getPreparedTransactionMessage     | url: string, body: string                                                                                                                                | Promise&lt;PrepareTransaction&gt;               | prepare transaction to send                          |
| getPreparedTransactionSwapMessage | url: string, body: string                                                                                                                                | Promise&lt;PrepareSwapTransaction&gt;           | prepare transaction to send for swap case            |
| getTransactionStatus              | statusToken: string, endpoint:string = '/transaction/status'                                                                                             | Promise&lt;OnlyContentAndTransactionPaylink&gt; | get transaction status                               |

```Typescript
import {
    FetchifyFindAddress,
    PaymentRequest,
    PaymentRequestType,
    FetchifyRetrieveAddress,
    Currency,
    PrepareTransaction,
    PrepareSwapTransaction,
    TokenQuoting,
    SwapRouteToken,
    PaymentRequestType,
    OnlyContentAndTransactionPaylink,
} from '@heliofi/common';
```
<br>

### Properties table for the SolExplorerService

| Methods                          | Params                 | Return  | Description                       |
|:---------------------------------|:-----------------------|:--------|:----------------------------------|
| getSolanaExplorerTransactionURL  | transactionID: string  | string  | get transaction URL by after pay  |

<br>

### Properties table for the TokenConversionService

| Methods                     | Params                                                               | Return  | Description                            |
|:----------------------------|:---------------------------------------------------------------------|:--------|:---------------------------------------|
| convertFromMinimalUnits     | symbol: string, minimalAmount: bigint, blockchain?: BlockchainSymbol | number  | convert from minimal amount            |
| convertToMinimalUnits       | symbol?: any actualAmount?: number                                   | number  | convert to minimal amount              |
| formatPrice                 | currency: Currency, normalizedAmount: number                         | string  | format price                           |
| convertFromMinimalAndRound  | symbol: string, minimalAmount: bigint                                | string  | convert from minimal amount and round  |

```Typescript
import { BlockchainSymbol, Currency } from '@heliofi/common';
```
<br>

### Properties table for the PaylinkSubmitService

| Methods            | Params                         | Return               | Description                                              |
|:-------------------|:-------------------------------|:---------------------|:---------------------------------------------------------|
| handleTransaction  | { props: CreatePaymentProps }  | Promise&lt;void&gt;  | prepare transaction, connect to wallet, send transaction |

```Typescript
import { Program } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { HelioIdl } from '@heliofi/solana-adapter';
import {
    OnlyContentAndSwapTransactionPaylink,
    OnlyContentAndTransactionPaylink,
    CustomerDetails,
    SplitWallet,
} from '@heliofi/common';

type ApproveTransactionResponse = OnlyContentAndTransactionPaylink | OnlyContentAndSwapTransactionPaylink;

interface PaymentEvent {
    transaction?: string;
}

interface ErrorPaymentEvent extends PaymentEvent {
    errorMessage: string;
}

interface PendingPaymentEvent extends PaymentEvent {
    transaction: string;
}

interface BasePaymentProps<ApproveTransactionResponse> {
    onSuccess: (event: SuccessPaymentEvent<ApproveTransactionResponse>) => void;
    onError: (event: ErrorPaymentEvent) => void;
    onPending?: (event: PendingPaymentEvent) => void;
    symbol: string;
    anchorProvider: Program<HelioIdl>;
    wallet: AnchorWallet;
    connection: Connection;
    rateToken?: string;
}

interface CreatePaymentProps
    extends BasePaymentProps<ApproveTransactionResponse> {
    recipientPK: string;
    amount: bigint;
    paymentRequestId: string;
    customerDetails?: CustomerDetails;
    quantity?: number;
    productDetails?: {
        name?: string;
        value?: string;
    };
    splitRevenue?: boolean;
    splitWallets?: SplitWallet[];
    wallet: AnchorWallet;
    connection: Connection;
    canSwapTokens?: boolean;
    swapRouteToken?: string;
    rateToken?: string;
}
```

<br>

### Properties table for the PolygonPaylinkSubmitService, EthPaylinkSubmitService

| Methods            | Params                        | Return               | Description                                               |
|:-------------------|:------------------------------|:---------------------|:----------------------------------------------------------|
| handleTransaction  | { props: CreatePaymentProps } | Promise&lt;void&gt;  | prepare transaction, connect to wallet, send transaction  |

```Typescript
import {
    BlockchainSymbol,
    CustomerDetails,
    ProductDetails,
    SplitWallet,
    OnlyContentAndTransactionPaylink,
} from '@heliofi/common';
import { Web3Provider } from '@ethersproject/providers';

enum LoadingModalStep {
    GET_PERMISSION = 'GET_PERMISSION',
    SIGN_TRANSACTION = 'SIGN_TRANSACTION',
    SUBMIT_TRANSACTION = 'SUBMIT_TRANSACTION',
    DEFAULT = 'DEFAULT',
    CLOSE = 'CLOSE',
}

type ClusterHelioType = 'devnet' | 'testnet' | 'mainnet';

interface PaymentEvent {
    transaction?: string;
}

interface ErrorPaymentEvent extends PaymentEvent {
    errorMessage: string;
}

interface PendingPaymentEvent extends PaymentEvent {
    transaction: string;
}

ApproveTransactionResponse = OnlyContentAndTransactionPaylink;

interface SuccessPaymentEvent<ApproveTransactionResponse> extends PaymentEvent {
    data: ApproveTransactionResponse;
    transaction: string;
    paymentPK?: string;
    swapTransactionSignature?: string;
}

interface BasePaymentProps<ApproveTransactionResponse> {
    onSuccess: (event: SuccessPaymentEvent<ApproveTransactionResponse>) => void;
    onError: (event: ErrorPaymentEvent) => void;
    onPending?: (event: PendingPaymentEvent) => void;
    onInitiated?: (event: PaymentEvent) => void;
    setLoadingModalStep: (step: LoadingModalStep) => void;
    onCancel?: () => void;
    symbol: string;
    blockchain?: BlockchainSymbol;
    anchorProvider: Web3Provider;
    rateToken?: string;
    customerDetails?: CustomerDetails;
    productDetails?: ProductDetails;
    mintAddress: string;
    isNativeMintAddress: boolean;
    cluster: ClusterHelioType;
}

interface CreatePaymentProps
    extends BasePaymentProps<ApproveTransactionResponse> {
    recipientPK: string;
    amount: bigint;
    paymentRequestId: string;
    quantity?: number;
    splitRevenue?: boolean;
    splitWallets?: SplitWallet[];
    discountToken?: string;
    canSwapTokens?: boolean;
    swapRouteToken?: string;
    rateToken?: string;
}
```

<br>

### Properties table for the PaystreamStartService

| Methods            | Params                         | Return               | Description                                                         |
|:-------------------|:-------------------------------|:---------------------|:--------------------------------------------------------------------|
| handleTransaction  | { props: CreatePaymentProps }  | Promise&lt;void&gt;  | prepare transaction, connect to wallet, send pay stream transaction |

```Typescript
import { Program } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import { HelioIdl } from '@heliofi/solana-adapter';
import {
    CustomerDetails,
    OnlyContentAndTransactionPaylink,
} from '@heliofi/common';

interface PaymentEvent {
    transaction?: string;
}

interface ErrorPaymentEvent extends PaymentEvent {
    errorMessage: string;
}

interface PendingPaymentEvent extends PaymentEvent {
    transaction: string;
}

interface CreatePaystreamResponse extends OnlyContentAndTransactionPaylink {} {
    document: {
        id: string;
        startedAt: bigint;
        endedAt: bigint;
    };
}

interface BasePaymentProps<CreatePaystreamResponse> {
    onSuccess: (event: SuccessPaymentEvent<CreatePaystreamResponse>) => void;
    onError: (event: ErrorPaymentEvent) => void;
    onPending?: (event: PendingPaymentEvent) => void;
    symbol: string;
    anchorProvider: Program<HelioIdl>;
    wallet: AnchorWallet;
    connection: Connection;
    rateToken?: string;
}

interface CreatePaystreamProps
    extends BasePaymentProps<CreatePaystreamResponse> {
    interval: number;
    maxTime: number;
    recipientPK: string;
    amount: bigint;
    paymentRequestId: string;
    customerDetails?: CustomerDetails;
    quantity?: number;
    rateToken?: string;
    productDetails?: {
        name?: string;
        value?: string;
    };
    canSwapTokens?: boolean;
    swapRouteToken?: string;
    swapSignedTx?: string;
}
```

<br>

### Properties table for the PaystreamCancelService

| Methods            | Params                         | Return               | Description                                                                     |
|:-------------------|:-------------------------------|:---------------------|:--------------------------------------------------------------------------------|
| handleTransaction  | { props: CancelStreamProps }   | Promise&lt;void&gt;  | prepare transaction, connect to wallet, send pay stream for cancel transaction  |

```Typescript
import { Program } from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Cluster, Connection } from "@solana/web3.js";
import { HelioIdl } from '@heliofi/solana-adapter';

interface BasePaymentProps<CancelStreamResponse> {
    onSuccess: (event: SuccessPaymentEvent<CancelStreamResponse>) => void;
    onError: (event: ErrorPaymentEvent) => void;
    onPending?: (event: PendingPaymentEvent) => void;
    symbol: string;
    anchorProvider: Program<HelioIdl>;
    wallet: AnchorWallet;
    connection: Connection;
    rateToken?: string;
}

interface CancelStreamResponse extends OnlyContentAndTransactionPaylink {}

interface CancelStreamProps extends BasePaymentProps<CancelStreamResponse> {
    paymentId: string;
}
```

<br>

### Properties table for the ConfigService

| Methods            | Params                                      | Return           | Description                                |
|:-------------------|:--------------------------------------------|:-----------------|:-------------------------------------------|
| getAssetUrl        | none                                        | string           | get helio assets url                       |
| getImageUrl        | name: string                                | string           | get helio images url                       |
| getCluster         | none                                        | ClusterHelioType | return selected cluster                    |
| getHelioApiBaseUrl | none                                        | string           | get Helio api base url for current cluster |
| getPhantomLink     | id: string, paymentType: PaymentRequestType | string           | get payment url for phantom app            |

```Typescript
import { PaymentRequestType } from '@heliofi/common';

type ClusterHelioType = 'devnet' | 'testnet' | 'mainnet';
```

## Example

```Typescript
import { HelioSDK, ClusterHelio } from '@heliofi/sdk';
import { Cluster } from '@solana/web3.js';

const cluster = ClusterHelio.Devnet;

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

//handle transaction paylink for sol blockchain
await helioSDK.paylinkService.handleTransaction({...});

//handle transaction paystream for sol blockchain
await helioSDK.paystreamStartService.handleTransaction({...});

//handle cancel transaction paystream for sol blockchain
await helioSDK.paystreamCancelService.handleTransaction({...});

//handle transaction for evm(polygon, ethereum) blockchain
await helioSDK.polygonPaylinkService.handleTransaction({...});
await helioSDK.ethPaylinkService.handleTransaction({...});
```