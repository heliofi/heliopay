import { Cluster } from '@solana/web3.js';

import {
  AvailableBalanceService,
  ConfigService,
  CurrencyService,
  HelioApiConnector,
  SolExplorerService,
  TokenConversionService,
} from '../domain';
import {
  HelioApiAdapter,
  PaylinkSubmitService,
  PaystreamStartService,
  PaystreamCancelService,
} from '../infrastructure';

export class HelioSDK {
  private _cluster?: Cluster;

  private _customApiUrl?: string;

  private _currencyService: CurrencyService;

  private _apiService: HelioApiConnector;

  private _tokenConversionService: TokenConversionService;

  private _solExplorerService: SolExplorerService;

  private _paylinkService: PaylinkSubmitService;

  private _paystreamStartService: PaystreamStartService;

  private _paystreamCancelService: PaystreamCancelService;

  private _configService: ConfigService;

  private _availableBalanceService: AvailableBalanceService;

  constructor(options?: { cluster: Cluster; customApiUrl: string }) {
    this._cluster = options?.cluster;
    this._customApiUrl = options?.customApiUrl;
    this._configService = new ConfigService({
      cluster: options?.cluster,
      customApiUrl: options?.customApiUrl,
    });
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
    this._availableBalanceService = new AvailableBalanceService(
      this._tokenConversionService,
      this._currencyService
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

  setCustomApiUrl(customApiUrl: string) {
    this._customApiUrl = customApiUrl;
    this._configService.setCustomApiUrl(customApiUrl);
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

  get availableBalanceService(): AvailableBalanceService | never {
    this.checkCluster();
    return this._availableBalanceService;
  }
}
