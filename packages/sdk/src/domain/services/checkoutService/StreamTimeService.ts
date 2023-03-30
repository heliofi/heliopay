import { IntervalType } from '@heliofi/common';

import { CreatePaymentService } from '../CreatePaymentService';

type GetInitialStreamTimeProps = {
  durationSec?: number;
  intervalType: IntervalType;
};

export class StreamTimeService {
  static getInitialStreamTime({
    durationSec,
    intervalType,
  }: GetInitialStreamTimeProps): number {
    return durationSec
      ? Math.ceil(CreatePaymentService.secondsToTime(intervalType, durationSec))
      : 0;
  }
}
