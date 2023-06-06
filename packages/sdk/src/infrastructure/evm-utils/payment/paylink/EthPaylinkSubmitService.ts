import { EvmPaylinkSubmitService } from './EvmPaylinkSubmitService';

export class EthPaylinkSubmitService extends EvmPaylinkSubmitService {
  protected override readonly endpoint = 'transaction/eth/submit';

  protected override readonly prepareEndpoint =
    '/prepare/transaction/eth/paylink';

  protected readonly statusEndpoint: string = '/transaction/eth/status';
}
