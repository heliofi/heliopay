import { Cluster } from '@solana/web3.js';
import {
  CurrencyService,
  SolExplorerService,
  TokenConversionService,
  ConfigService,
  HelioApiConnector,
} from '../domain';
import { HelioApiAdapter, PaylinkSubmitService } from '../infrastructure';

export class HelioSDK {
  private _cluster: Cluster | undefined;

  private _currencyService: CurrencyService;

  private _apiService: HelioApiConnector;

  private _tokenConversionService: TokenConversionService;

  private _solExplorerService: SolExplorerService;

  private _paylinkService: PaylinkSubmitService;

  private _configService: ConfigService;

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

  get configService(): ConfigService | never {
    this.checkCluster();
    return this._configService;
  }
}
