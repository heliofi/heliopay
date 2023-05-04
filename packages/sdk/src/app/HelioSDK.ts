import { Cluster } from '@solana/web3.js';

import {
  SolAvailableBalanceService,
  ConfigService,
  CurrencyService,
  HelioApiConnector,
  SolExplorerService,
  TokenConversionService,
  PolygonAvailableBalanceService,
  AvailableBalanceService,
  EthereumAvailableBalanceService,
} from '../domain';
import {
  HelioApiAdapter,
  PaylinkSubmitService,
  PaystreamStartService,
  PaystreamCancelService,
} from '../infrastructure';
import { PolygonPaylinkSubmitService } from '../infrastructure/evm-utils/payment/paylink/PolygonPaylinkSubmitService';
import { EthPaylinkSubmitService } from '../infrastructure/evm-utils/payment/paylink/EthPaylinkSubmitService';

export class HelioSDK {
  private _cluster?: Cluster;

  private _currencyService: CurrencyService;

  private _apiService: HelioApiConnector;

  private _tokenConversionService: TokenConversionService;

  private _solExplorerService: SolExplorerService;

  private _paylinkService: PaylinkSubmitService;

  private _polygonPaylinkService: PolygonPaylinkSubmitService;

  private _ethPaylinkService: EthPaylinkSubmitService;

  private _paystreamStartService: PaystreamStartService;

  private _paystreamCancelService: PaystreamCancelService;

  private _configService: ConfigService;

  private _solAvailableBalanceService: SolAvailableBalanceService;

  private _ethAvailableBalanceService: EthereumAvailableBalanceService;

  private _polygonAvailableBalanceService: PolygonAvailableBalanceService;

  private _availableBalanceService: AvailableBalanceService;

  constructor(options?: { cluster: Cluster }) {
    this._cluster = options?.cluster;
    this._configService = new ConfigService(options?.cluster);
    this._apiService = new HelioApiAdapter(this._configService);
    this._currencyService = new CurrencyService(this._apiService);
    this._tokenConversionService = new TokenConversionService(
      this._currencyService
    );
    this._solExplorerService = new SolExplorerService(this._configService);
    this._paylinkService = new PaylinkSubmitService(
      this._apiService,
      this._currencyService,
      this._configService
    );
    this._polygonPaylinkService = new PolygonPaylinkSubmitService(
      this._apiService,
      this._currencyService,
      this._configService
    );
    this._ethPaylinkService = new EthPaylinkSubmitService(
      this._apiService,
      this._currencyService,
      this._configService
    );
    this._paystreamStartService = new PaystreamStartService(
      this._apiService,
      this._currencyService,
      this._configService
    );
    this._paystreamCancelService = new PaystreamCancelService(
      this._apiService,
      this._currencyService,
      this._configService
    );
    this._solAvailableBalanceService = new SolAvailableBalanceService(
      this._tokenConversionService,
      this._currencyService
    );
    this._ethAvailableBalanceService = new EthereumAvailableBalanceService(
      this._tokenConversionService,
      this._currencyService
    );
    this._polygonAvailableBalanceService = new PolygonAvailableBalanceService(
      this._tokenConversionService,
      this._currencyService
    );
    this._availableBalanceService = new AvailableBalanceService(
      this._tokenConversionService,
      this._currencyService,
      this._solAvailableBalanceService,
      this._polygonAvailableBalanceService,
      this._ethAvailableBalanceService
    );
  }

  private checkCluster(): void | never {
    if (!this._cluster) {
      throw new Error('Please set cluster');
    }
  }

  setCluster(cluster: Cluster) {
    this._cluster = cluster;
    this._configService.setCluster(cluster);
  }

  get currencyService(): CurrencyService | never {
    this.checkCluster();
    return this._currencyService;
  }

  get apiService(): HelioApiConnector | never {
    this.checkCluster();
    return this._apiService;
  }

  get solExplorerService(): SolExplorerService | never {
    this.checkCluster();
    return this._solExplorerService;
  }

  get tokenConversionService(): TokenConversionService | never {
    this.checkCluster();
    return this._tokenConversionService;
  }

  get paylinkService(): PaylinkSubmitService | never {
    this.checkCluster();
    return this._paylinkService;
  }

  get polygonPaylinkService(): PolygonPaylinkSubmitService | never {
    this.checkCluster();
    return this._polygonPaylinkService;
  }

  get ethPaylinkService(): EthPaylinkSubmitService | never {
    this.checkCluster();
    return this._ethPaylinkService;
  }

  get paystreamStartService(): PaystreamStartService | never {
    this.checkCluster();
    return this._paystreamStartService;
  }

  get paystreamCancelService(): PaystreamCancelService | never {
    this.checkCluster();
    return this._paystreamCancelService;
  }

  get configService(): ConfigService | never {
    this.checkCluster();
    return this._configService;
  }

  get solAvailableBalanceService(): SolAvailableBalanceService | never {
    this.checkCluster();
    return this._solAvailableBalanceService;
  }

  get ethAvailableBalanceService(): EthereumAvailableBalanceService | never {
    this.checkCluster();
    return this._ethAvailableBalanceService;
  }

  get polygonAvailableBalanceService(): PolygonAvailableBalanceService | never {
    this.checkCluster();
    return this._polygonAvailableBalanceService;
  }

  get availableBalanceService(): AvailableBalanceService | never {
    this.checkCluster();
    return this._availableBalanceService;
  }
}
