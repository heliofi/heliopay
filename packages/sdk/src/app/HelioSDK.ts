import {
  ClusterType,
  CurrencyService,
  SolExplorerService,
  TokenConversionService,
  ConfigService,
} from "../domain";
import { HelioApiAdapter, PaylinkSubmitService } from "../infrastructure";

export class HelioSDK {
  private static instance: HelioSDK;

  private currencyService: CurrencyService;

  private apiService: HelioApiAdapter;

  private tokenConversionService: TokenConversionService;

  private solExplorerService: SolExplorerService;

  private paylinkService: PaylinkSubmitService;

  private configService: ConfigService;

  constructor(private cluster: ClusterType) {
    this.configService = new ConfigService(cluster);
    this.apiService = new HelioApiAdapter(this.configService);
    this.currencyService = new CurrencyService(this.apiService);
    this.tokenConversionService = new TokenConversionService(
      this.currencyService
    );
    this.solExplorerService = new SolExplorerService(this.configService);
    this.paylinkService = new PaylinkSubmitService(
      this.apiService,
      this.currencyService,
      this.configService
    );
  }

  static init(cluster: ClusterType): typeof HelioSDK {
    this.instance = new HelioSDK(cluster);
    return HelioSDK;
  }

  static getInstance(): HelioSDK {
    if (!this.instance) {
      throw new Error("please call HelioSDK.init before getInstance");
    }

    return this.instance;
  }

  static get currencyService(): CurrencyService {
    return HelioSDK.getInstance().currencyService;
  }

  static get apiService(): HelioApiAdapter {
    return HelioSDK.getInstance().apiService;
  }

  static get solExplorerService(): SolExplorerService {
    return HelioSDK.getInstance().solExplorerService;
  }

  static get tokenConversionService(): TokenConversionService {
    return HelioSDK.getInstance().tokenConversionService;
  }

  static get paylinkService(): PaylinkSubmitService {
    return HelioSDK.getInstance().paylinkService;
  }

  static get configService(): ConfigService {
    return HelioSDK.getInstance().configService;
  }
}
