import { IntervalType } from '@heliofi/common';

import { DAY, HOUR, MINUTE, MONTH, SECOND_MS, WEEK } from '../constants';

export class CreatePaymentService {
  static shortenTransaction(transactionAddress: string): string {
    return `${transactionAddress.slice(0, 4)}...${transactionAddress.slice(
      -4
    )}`;
  }

  static timeToSeconds(chargeBy: IntervalType, count: number): number {
    if (chargeBy === IntervalType.MINUTE) {
      return count * MINUTE;
    }
    if (chargeBy === IntervalType.HOUR) {
      return count * HOUR;
    }
    if (chargeBy === IntervalType.DAY) {
      return count * DAY;
    }
    if (chargeBy === IntervalType.WEEK) {
      return count * WEEK;
    }
    if (chargeBy === IntervalType.MONTH) {
      return count * MONTH;
    }
    return count;
  }

  static secondsToTime(chargeBy: IntervalType, seconds: number): number {
    switch (chargeBy) {
      case IntervalType.MONTH:
        return seconds / MONTH;
      case IntervalType.WEEK:
        return seconds / WEEK;
      case IntervalType.DAY:
        return seconds / DAY;
      case IntervalType.HOUR:
        return seconds / HOUR;
      case IntervalType.MINUTE:
        return seconds / MINUTE;
      default:
        return seconds;
    }
  }

  static secondsToHumanReadable(seconds: number): string {
    if (seconds < MINUTE) {
      return `${seconds} seconds`;
    }

    const dateStrPositions = {
      end: 19,
      minute: 14,
      hour: 11,
      day: 8,
      month: 5,
    };

    if (seconds < HOUR) {
      return new Date(seconds * SECOND_MS)
        .toISOString()
        .slice(dateStrPositions.minute, dateStrPositions.end);
    }

    if (seconds < DAY) {
      return new Date(seconds * SECOND_MS)
        .toISOString()
        .slice(dateStrPositions.hour, dateStrPositions.end);
    }

    if (seconds < MONTH) {
      return new Date(seconds * SECOND_MS)
        .toISOString()
        .slice(dateStrPositions.day, dateStrPositions.end);
    }

    return new Date(seconds * SECOND_MS)
      .toISOString()
      .slice(dateStrPositions.month, dateStrPositions.end);
  }
}
