import test from 'ava'

import * as moment from 'moment'
import firstFullWeekOfYear from '@strong-roots-capital/first-full-week-of-year'
import listTradingviewFormats from '@strong-roots-capital/list-tradingview-formats'
import {
    isTradingviewFormatMonths,
    isTradingviewFormatWeeks,
    isTradingviewFormatDays,
    isTradingviewFormatHours,
    isTradingviewFormatMinutes
} from '@strong-roots-capital/is-tradingview-format'

import { ArgumentError } from '../src/argument-error'

/**
 * Library under test
 */

import getRecentSessions from '../src/get-recent-sessions'

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
    throw new ArgumentError(`Cannot interpret session interval '${timeframe}'`, mostRecentSessions)
}

function mostRecentSessions(timeframe: string, from: Date): number[] {

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

const recentSessionsIncludes = (t: any, timeframe: string, from: Date, session: number, recentSessions: number[]) => t.true(recentSessions.includes(session))
recentSessionsIncludes.title = (_ = '', timeframe: string, from: Date, session: number, recentSessions: number[]) => `${timeframe} sessions from ${from.toISOString()} should include ${new Date(session).toISOString()}`

const testRecentSessionsIncludes = (timeframe: string, from: Date) => {
    const mostRecent = mostRecentSessions(timeframe, from)
    const recentSessions = getRecentSessions(timeframe, from)
    for (const session of mostRecent) {
        test(recentSessionsIncludes, timeframe, from, session, recentSessions)
    }
}

for (const format of listTradingviewFormats()) {
    testRecentSessionsIncludes(format, new Date())
}
