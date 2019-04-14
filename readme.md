# get-recent-sessions [![Build status](https://travis-ci.org/strong-roots-capital/get-recent-sessions.svg?branch=master)](https://travis-ci.org/strong-roots-capital/get-recent-sessions) [![npm version](https://img.shields.io/npm/v/@strong-roots-capital/get-recent-sessions.svg)](https://npmjs.org/package/@strong-roots-capital/get-recent-sessions) [![codecov](https://codecov.io/gh/strong-roots-capital/get-recent-sessions/branch/master/graph/badge.svg)](https://codecov.io/gh/strong-roots-capital/get-recent-sessions)

> Get boundaries between recent timeframes (inclusive)

## Install

``` shell
npm install @strong-roots-capital/get-recent-sessions
```

## Use

``` typescript
import getRecentSessions from '@strong-roots-capital/get-recent-sessions'

console.log(getRecentSessions('8M', new Date('2019-02-14T00:00:00.000Z'))
//=> [ 1514764800000, 1535760000000, 1546300800000 ]
```

## Related

- [is-tradingview-format](https://github.com/strong-roots-capital/is-tradingview-format)
