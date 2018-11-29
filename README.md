Parse & sum [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) to date

## Example
```js
import { duration } from 'iso-duration'

const dayBefore = duration('-P1D')

const { negative, year, month, week, day, hour, minute, second } = dayBefore
console.log({ negative, year, month, week, day, hour, minute, second })
// output parsed values: { negative: true, year: 0, month: 0, week: 0, day: -1, hour: 0, minute: 0, second: 0 }

const yesterday = dayBefore(new Date())
// today's Date less 1 day
```

## API

### duration

Higher order function `duration` argument must be a valid ISO 8601 duration string formated as `PnYnMnDTnHnMnS` or `PnW` (n being *integer*).

It returns a function to sum parsed duration to given date (accorging duration sign), decorated with parsed values.

Throws an Error when it cannot parse the value.

- date & time durations

```js
const inTreeDaysAndTwelveHours = duration('P3DT12H')(new Date())
```

- substract & negative durations

```js
const yesterday = duration('-P1D')(new Date())
const alsoYesterday = duration('P1D')(new Date(), { substract: true })
const stillYesterday = duration('-P1D')(new Date(), { substract: true })

```

- week durations

```js
const inTwoWeeks = duration('P2W')(new Date())
const twoWeeksAgo = duration('-P2W')(new Date())
```

- strict option set as false (default behavior)

```js
const tomorrow = duration('P1D')(new Date())
```

Time in the day won't be affected by daylight saving time (DST)

Time interval between the date given and returned may be affected by DST and not equal to duration

- strict option set as true

```js
const tomorrow = duration('P1D')(new Date(), { strict: true })
```

Time in the day may be affected by daylight saving time (DST)

Time interval between the date given and returned will be stricly equal to duration
