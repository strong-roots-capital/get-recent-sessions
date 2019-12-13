/**
 * get-recent-sessions
 * Get boundaries between recent timeframes
 */

import D from 'od'
import ow from 'ow'
import firstFullWeekOfYear from '@strong-roots-capital/first-full-week-of-year'
import {
    inTradingviewFormat,
    isTradingviewFormatWeeks
} from '@strong-roots-capital/is-tradingview-format'

import {
    timeUnitOfTimeframe,
    timeframeDivisor
} from './utils'


const compose = <R>(fn1: (a: R) => R, ...fns: Array<(a: R) => R>) =>
    fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1)

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
export default function getRecentSessions(
    timeframe: string,
    from: Date = new Date(Date.now())
): number[] {

    ow(timeframe, ow.string.is(inTradingviewFormat))
    ow(from, ow.date)

    const quantifier = parseInt(timeframe, 10)
    const divisor = timeframeDivisor(timeframe)
    const unit = timeUnitOfTimeframe(timeframe)

    const startOfPreviousSession: (a: Date) => Date = compose(
        D.startOf(divisor),
        D.subtract(divisor, 1)
    )

    let clock = isTradingviewFormatWeeks(timeframe)
        ? firstFullWeekOfYear(D.get('year', from) - 1)
        : startOfPreviousSession(from)

    let clockStart = new Date(clock)
    const fromTime = from.valueOf()
    const sessions: number[] = []

    while (clock.valueOf() <= fromTime) {
        sessions.push(clock.valueOf())

        clock = isTradingviewFormatWeeks(timeframe)
            ? D.add('day', quantifier * 7, clock)
            : D.add(unit, quantifier, clock)

        if (D.get(divisor, clock) !== D.get(divisor, clockStart)) {
            clock = isTradingviewFormatWeeks(timeframe)
                ? firstFullWeekOfYear(D.get('year', clock))
                : D.startOf(divisor, clock)
            clockStart = clock
        }
    }
    return sessions
}
