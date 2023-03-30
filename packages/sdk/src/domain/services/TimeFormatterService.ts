import moment from 'moment';
import { IntervalType } from '@heliofi/common';

import { NumberService } from './NumberService';
import { HOUR, MINUTE, SECOND_MS } from '../constants';

export class TimeFormatterService {
  static toDateString(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return moment(date).format('DD/MM/YYYY');
  }

  static toTimeString(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return moment(date).format('HH:mm:ss');
  }

  static toDateTimeString(dateTimeString: string): string {
    return `${TimeFormatterService.toDateString(
      dateTimeString
    )} - ${TimeFormatterService.toTimeString(dateTimeString)}`;
  }

  static secondsRemaining(unixTime: number): number {
    return unixTime - Date.now() / SECOND_MS;
  }

  static secondsToInterval(seconds: number): IntervalType {
    if (seconds >= HOUR) {
      return IntervalType.HOUR;
    }

    if (seconds >= MINUTE) {
      return IntervalType.MINUTE;
    }

    return IntervalType.SECOND;
  }

  static helioPlayTimeFormat(seconds: number): string {
    const interval = TimeFormatterService.secondsToInterval(seconds);

    switch (interval) {
      case IntervalType.SECOND:
        return `${seconds} Seconds`;
      case IntervalType.MINUTE:
        return `${Math.floor(seconds / MINUTE)}:${NumberService.padStart(
          seconds % MINUTE,
          2
        )} Minutes`;
      case IntervalType.HOUR:
        return `${Math.floor(seconds / 3600)}:${NumberService.padStart(
          Math.floor((seconds / MINUTE) % MINUTE),
          2
        )} Hours`;
      default:
        return '';
    }
  }
}
