
get-recent-sessions [![Build status](https://travis-ci.org/strong-roots-capital/get-recent-sessions.svg?branch=master)](https://travis-ci.org/strong-roots-capital/get-recent-sessions) [![npm version](https://img.shields.io/npm/v/@strong-roots-capital/get-recent-sessions.svg)](https://npmjs.org/package/@strong-roots-capital/get-recent-sessions) [![codecov](https://codecov.io/gh/strong-roots-capital/get-recent-sessions/branch/master/graph/badge.svg)](https://codecov.io/gh/strong-roots-capital/get-recent-sessions)
====================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

> Get boundaries between recent timeframes

Install
-------

```shell
npm install @strong-roots-capital/get-recent-sessions
```

Use
---

```typescript
import getRecentSessions from '@strong-roots-capital/get-recent-sessions'

console.log(getRecentSessions('8M', new Date('2019-02-14T00:00:00.000Z'))
//=> [ 1514764800000, 1535760000000, 1546300800000 ]
```

Related
-------

*   [is-tradingview-format](https://github.com/strong-roots-capital/is-tradingview-format)

## Index

### Functions

* [getRecentSessions](#getrecentsessions)

---

## Functions

<a id="getrecentsessions"></a>

###  getRecentSessions

▸ **getRecentSessions**(timeframe: *`string`*, from?: *`Date`*): `number`[]

*Defined in [get-recent-sessions.ts:30](https://github.com/strong-roots-capital/get-recent-sessions/blob/91f5dc0/src/get-recent-sessions.ts#L30)*

Return several `timeframe` session-boundaries preceding `from`.

*__remarks__*: This function starts enumerating session-boundaries at the start of the preceding "alignment duration". An alignment duration is a large-timeframe used to align new instances of a smaller-timeframe, e.g. 1D closes are used to align 1H closes, and 1W closes are aligned by new years.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| timeframe | `string` | - |  Timeframe length in Trading View format |
| `Default value` from | `Date` |  utcDate() |  Date used as \`now\` when finding recent sessions |

**Returns:** `number`[]
List of Unix times describing start of most recent

___

