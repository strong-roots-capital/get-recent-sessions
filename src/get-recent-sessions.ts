/**
 * get-recent-sessions
 * Get boundaries between recent timeframes
 */

import ow from 'ow'
import moment from 'moment'
import { utcDate } from '@hamroctopus/utc-date'
import firstFullWeekOfYear from '@strong-roots-capital/first-full-week-of-year'
import {
    inTradingviewFormat,
    isTradingviewFormatMonths,
    isTradingviewFormatWeeks,
    isTradingviewFormatDays,
    isTradingviewFormatHours,
    isTradingviewFormatMinutes
} from '@strong-roots-capital/is-tradingview-format'

import { ArgumentError } from './argument-error'

/**
 * Return the duration (as a `moment.unitOfTime.Base`) of a timeframe
 * in Trading View format.
 *
 * @param timeframe - Timeframe of which to determine duration
 * @returns Duration of timeframe as `moment.unitOfTime.Base`
 */
function unitOfDuration(timeframe: string): moment.unitOfTime.Base {

    const durationTranslations: [ (s: string) => boolean, moment.unitOfTime.Base ][] = [
        [isTradingviewFormatMinutes, 'minute'],
        [isTradingviewFormatHours, 'hour'],
        [isTradingviewFormatDays, 'day'],
        [isTradingviewFormatWeeks, 'week'],
        [isTradingviewFormatMonths, 'month']
    ]
    for (const [isTimeframe, duration] of durationTranslations) {
        if (isTimeframe(timeframe)) {
            return duration
        }
    }

    /**
     * Note: this statement should never run. If you are seeing this
     * error, the argument validation above is incorrect
     */
    throw new ArgumentError(`Cannot interpret session interval '${timeframe}'`, unitOfDuration)
}

/**
 * Return the large-duration which Trading View uses to align
 * small-durations.
 *
 * @param timeframe - Duration to use as small-duration
 * @returns Duration used to align units of `timeframe`
 */
function nextLargerDurationDivisor(timeframe: string): moment.unitOfTime.Base {

    const nextLargerDurationDivisor: [ (s: string) => boolean, moment.unitOfTime.Base ][] = [
        [isTradingviewFormatMinutes, 'day'],
        [isTradingviewFormatHours, 'day'],
        [isTradingviewFormatDays, 'year'],
        [isTradingviewFormatWeeks, 'year'],
        [isTradingviewFormatMonths, 'year']
    ]
    for (const [isTimeframe, nextLargerDuration] of nextLargerDurationDivisor) {
        if (isTimeframe(timeframe)) {
            return nextLargerDuration
        }
    }

    /**
     * Note: this statement should never run. If you are seeing this
     * error, the argument validation above is incorrect
     */
    throw new ArgumentError(`Cannot interpret session interval '${timeframe}'`, getRecentSessions)
}
/**
 * Return several `timeframe` session-boundaries preceding `from`.
 *
 * @remarks

 * This function starts enumerating session-boundaries at the start of
 * the preceding "alignment duration".  An alignment duration is a
 * large-timeframe used to align new instances of a smaller-timeframe,
 * e.g. 1D closes are used to align 1H closes, and 1W closes are
 * aligned by new years.
 *
 * @param timeframe - Timeframe length in Trading View format
 * @param from - Date used as `now` when finding recent sessions
 * @returns List of Unix times describing start of most recent
 */
export default function getRecentSessions(timeframe: string, from: Date = utcDate()): number[] {

    ow(timeframe, ow.string.is(inTradingviewFormat))

    const quantifier = parseInt(timeframe)
    const durationDivisor = nextLargerDurationDivisor(timeframe)

    const now = moment.utc(from)
    let clock = isTradingviewFormatWeeks(timeframe)
        ? moment.utc(firstFullWeekOfYear(from.getFullYear() - 1))
        : now.clone().subtract(1, durationDivisor).startOf(durationDivisor)
    let clockStart = clock.clone()

    let sessions: Date[] = []
    while (clock.isSameOrBefore(now)) {
        sessions.push(clock.toDate())
        isTradingviewFormatWeeks(timeframe)
            ? clock.add(quantifier * 7, 'days')
            : clock.add(quantifier, unitOfDuration(timeframe))
        if (!clock.isSame(clockStart, durationDivisor)) {
            clock = isTradingviewFormatWeeks(timeframe)
                ? moment.utc(firstFullWeekOfYear(clock.year()))
                : clock.startOf(durationDivisor)
            clockStart = clock.clone()
        }
    }
    return sessions.map(d => d.getTime())
}
