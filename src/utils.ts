/**
 * @hidden
 */

import ow from 'ow'
import * as moment from 'moment'

import {
    inTradingviewFormat,
    isTradingviewFormatMonths,
    isTradingviewFormatWeeks,
    isTradingviewFormatDays,
    isTradingviewFormatHours,
    isTradingviewFormatMinutes
} from '@strong-roots-capital/is-tradingview-format'

/**
 * Return the duration (as a `moment.unitOfTime.Base`) of a timeframe
 * in Trading View format.
 *
 * @param timeframe - Timeframe of which to determine duration
 * @returns Duration of timeframe as `moment.unitOfTime.Base`
 */
export function unitOfDuration(timeframe: string): moment.unitOfTime.Base {

    ow(timeframe, ow.string.is(inTradingviewFormat))

    const durationTranslations: [ (s: string) => boolean, moment.unitOfTime.Base ][] = [
        [isTradingviewFormatMinutes, 'minute'],
        [isTradingviewFormatHours, 'hour'],
        [isTradingviewFormatDays, 'day'],
        [isTradingviewFormatWeeks, 'week'],
        // [isTradingviewFormatMonths, 'month']
    ]
    for (const [isTimeframe, duration] of durationTranslations) {
        if (isTimeframe(timeframe)) {
            return duration
        }
    }

    return 'month'
}

/**
 * Return the large-duration which Trading View uses to align
 * small-durations.
 *
 * @param timeframe - Duration to use as small-duration
 * @returns Duration used to align units of `timeframe`
 */
export function nextLargerDurationDivisor(timeframe: string): moment.unitOfTime.Base {

    ow(timeframe, ow.string.is(inTradingviewFormat))

    const nextLargerDurationDivisor: [ (s: string) => boolean, moment.unitOfTime.Base ][] = [
        [isTradingviewFormatMinutes, 'day'],
        [isTradingviewFormatHours, 'day'],
        // [isTradingviewFormatDays, 'year'],
        // [isTradingviewFormatWeeks, 'year'],
        // [isTradingviewFormatMonths, 'year']
    ]
    for (const [isTimeframe, nextLargerDuration] of nextLargerDurationDivisor) {
        if (isTimeframe(timeframe)) {
            return nextLargerDuration
        }
    }

    return 'year'
}
