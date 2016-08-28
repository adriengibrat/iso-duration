Parse [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations)

## Example
```js
const today = new Date()
	, parsedDuration = parseDuration('-P1D')
console.log(parsedDuration)
// output
// {year: 0, month: 0, week: 0, day: -1, hour: 0, minute: 0, second: 0, add: function add(date)}
```

## API

### `parseDuration (<String>duration) => <Object>`

`duration` must be a valid ISO 8601 duration: "PnYnMnDTnHnMnS" and "PnW" formats are accepted (n being *integer*)

Throw an Error when `duration` cannot be parsed.

Returns parsed duration object with `add` & `addUTC` methods that sums/substracts duration to given date (accorging duration sign)

```js
{
	year: <Integer>,
	month: <Integer>,
	week: <Integer>,
	day: <Integer>,
	hour: <Integer>,
	minute: <Integer>,
	second: <Integer>,
	add(<Date>) => <Date>,
	addUTC(<Date>) => <Date>
}
```

#### addUTC method

Time in the day may be affected by daylight saving time (DST)

Time interval between the date given and returned will be stricly equal to duration

#### add method

Time in the day won't be affected by daylight saving time (DST)

Time interval between the date given and returned may be affected by DST and not equal to duration

#### date & time durations

```js
const today = new Date()
	, inTreeDaysAndTwelveHours = parseDuration('P3DT12H').add(today)
```

#### negative durations

```js
const today = new Date(),
	, yesterday = parseDuration('-P1D').add(today)
	, tomorrow = parseDuration('P1D').add(today)
```

#### week durations

```js
const today = new Date()
	, inTwoWeeks = parseDuration('P2W').add(today)
```