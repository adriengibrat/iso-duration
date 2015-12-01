Parse [ISO 8601 duration](https://en.wikipedia.org/wiki/ISO_8601#Durations)

## Example
```
var parsedDuration = parseDuration('-P1D'),
	today = new Date(),
	yesterday = parsedDuration.add(today)
;
```

## API

### `parseDuration (<String>duration) => <Object>`

`duration` must be a valid ISO 8601 duration: "PnYnMnDTnHnMnS" and "PnW" formats are accepted (n being *integer*)

Throw an Error when `duration` cannot be parsed.

Returns parsed duration object with `add` method that sums or substracts parsed duration to a given date, accorging duration sign:
```
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
