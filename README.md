Parse [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations)

## Example
```js
var today = new Date()
	parsedDuration = parseDuration('-P1D')
;
console.log(parsedDuration);
// output
// {year: 0, month: 0, week: 0, day: -1, hour: 0, minute: 0, second: 0, add: function add(date)}
```

## API

### `parseDuration (<String>duration) => <Object>`

`duration` must be a valid ISO 8601 duration: "PnYnMnDTnHnMnS" and "PnW" formats are accepted (n being *integer*)

Throw an Error when `duration` cannot be parsed.

Returns parsed duration object with `add` method that sums/substracts duration to given date (accorging duration sign)

```js
{
	year: <Integer>,
	month: <Integer>,
	week: <Integer>,
	day: <Integer>,
	hour: <Integer>,
	minute: <Integer>,
	second: <Integer>
	add(<Date>) => <Date>
}
```

#### Example: support negative durations

```js
var today = new Date(),
	yesterday = parseDuration('-P1D').add(today),
	tomorrow = parseDuration('P1D').add(today)
;
```

#### Example: support date & time durations

```js
var today = new Date(),
	inTreeDaysAndTwelveHours = parseDuration('P3DT12H').add(today)
;
```

#### Example: support week durations

```js
var today = new Date(),
	inTwoWeeks = parseDuration('P2W').add(today)
;
```