import test from 'ava'

import moment from 'moment'
import firstFullWeekOfYear from '@strong-roots-capital/first-full-week-of-year'
import listTradingviewFormats from '@strong-roots-capital/list-tradingview-formats'
import { isTradingviewFormatWeeks } from '@strong-roots-capital/is-tradingview-format'

import { timeUnitOfTimeframe, timeframeDivisor } from '../src/utils'

/**
 * Library under test
 */

import getRecentSessions from '../src/get-recent-sessions'

function mostRecentSessions(timeframe: string, from: Date): number[] {

    const quantifier = parseInt(timeframe)
    const durationDivisor = timeframeDivisor(timeframe)

    const now = moment.utc(from)
    let clock = isTradingviewFormatWeeks(timeframe)
        ? moment.utc(firstFullWeekOfYear(from.getUTCFullYear() - 1))
        : now.clone().subtract(1, durationDivisor).startOf(durationDivisor)
    let clockStart = clock.clone()

    let sessions: Date[] = []
    while (clock.isSameOrBefore(now)) {
        sessions.push(clock.toDate())
        isTradingviewFormatWeeks(timeframe)
            ? clock.add(quantifier * 7, 'days')
            : clock.add(quantifier, timeUnitOfTimeframe(timeframe))
        if (!clock.isSame(clockStart, durationDivisor)) {
            clock = isTradingviewFormatWeeks(timeframe)
                ? moment.utc(firstFullWeekOfYear(clock.year()))
                : clock.startOf(durationDivisor)

            clockStart = clock.clone()
        }
    }
    return sessions.map(d => d.getTime())
}

const recentSessionsIncludes = (
    t: any,
    _timeframe: string,
    _from: Date,
    session: number,
    recentSessions: number[]
) =>
    t.true(recentSessions.includes(session))

recentSessionsIncludes.title = (
    _ = '',
    timeframe: string,
    from: Date,
    session: number,
    _recentSessions: number[]
) => `${timeframe} sessions from ${from.toISOString()} should include ${new Date(session).toISOString()}`

const testRecentSessionsIncludes = (timeframe: string, from: Date) => {
    // console.log('Timeframe', timeframe, 'from', from)
    const mostRecent = mostRecentSessions(timeframe, from)
    const recentSessions = getRecentSessions(timeframe, from)
    // console.log('Should include sessions', mostRecent.map(t => (new Date(t)).toISOString()))
    // console.log('Did include sessions', recentSessions.map(t => (new Date(t)).toISOString()))
    for (const session of mostRecent) {
        test(recentSessionsIncludes, timeframe, from, session, recentSessions)
    }
}

for (const format of listTradingviewFormats()) {
    testRecentSessionsIncludes(format, new Date())
}

test('should use current date when `from` is omitted', t => {
    t.deepEqual(getRecentSessions('1W', new Date(Date.now())), getRecentSessions('1W'))
})
