import { EvmPaylinkSubmitService } from './EvmPaylinkSubmitService';

export class PolygonPaylinkSubmitService extends EvmPaylinkSubmitService {
  protected override readonly endpoint = 'transaction/polygon/submit';

  protected override readonly prepareEndpoint =
    '/prepare/transaction/polygon/paylink';

  protected readonly statusEndpoint: string = '/transaction/polygon/status';
}
