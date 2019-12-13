/**
 * @hidden
 */

import {
    isTradingviewFormatDays,
    isTradingviewFormatHours,
    isTradingviewFormatMinutes
} from '@strong-roots-capital/is-tradingview-format'


export type UnitOfTime =
    | 'month'
    | 'day'
    | 'hour'
    | 'minute'


export function timeUnitOfTimeframe(timeframe: string): UnitOfTime {

    const durationTranslations: [(s: string) => boolean, UnitOfTime][] = [
        [isTradingviewFormatMinutes, 'minute'],
        [isTradingviewFormatHours, 'hour'],
        [isTradingviewFormatDays, 'day'],
    ]
    for (const [isTimeframe, duration] of durationTranslations) {
        if (isTimeframe(timeframe)) {
            return duration
        }
    }

    return 'month'
}

/**
 * Return the large-duration timeframe Trading View uses to align
 * small durations.
 */
export function timeframeDivisor(timeframe: string): 'day' | 'year' {

    const nextLargerDurationDivisor: [(s: string) => boolean, 'day' | 'year'][] = [
        [isTradingviewFormatMinutes, 'day'],
        [isTradingviewFormatHours, 'day'],
    ]
    for (const [isTimeframe, nextLargerDuration] of nextLargerDurationDivisor) {
        if (isTimeframe(timeframe)) {
            return nextLargerDuration
        }
    }

    return 'year'
}

//  LocalWords:  durations
