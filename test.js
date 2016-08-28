import test from 'ava'
import parseDuration from './parseDuration.es5'

test('throws on invalid duration', assert => {
	assert.throws(() => parseDuration('X'), Error)
})

test('parse duration', assert => {
	assert.is(parseDuration('P1Y').year, 1, 'parsing years')
	assert.is(parseDuration('P1M').month, 1, 'parsing months')
	assert.is(parseDuration('P1D').day, 1, 'parsing days')
	assert.is(parseDuration('PT1H').hour, 1, 'parsing hours')
	assert.is(parseDuration('PT1M').minute, 1, 'parsing minutes')
	assert.is(parseDuration('PT1S').second, 1, 'parsing seconds')

	const duration = parseDuration('P1M2DT3H4M5S')
	assert.is(duration.year, 0, 'parsing duration years')
	assert.is(duration.month, 1, 'parsing duration months')
	assert.is(duration.day, 2, 'parsing duration days')
	assert.is(duration.hour, 3, 'parsing duration hours')
	assert.is(duration.minute, 4, 'parsing duration minutes')
	assert.is(duration.second, 5, 'parsing duration seconds')
})

test('parse negative duration', assert => {
	assert.is(parseDuration('-P1Y').year, -1, 'parsing years')
	assert.is(parseDuration('-P1M').month, -1, 'parsing months')
	assert.is(parseDuration('-P1D').day, -1, 'parsing days')
	assert.is(parseDuration('-PT1H').hour, -1, 'parsing hours')
	assert.is(parseDuration('-PT1M').minute, -1, 'parsing minutes')
	assert.is(parseDuration('-PT1S').second, -1, 'parsing seconds')

	const duration = parseDuration('-P1M2DT3H4M5S')
	assert.is(duration.year, 0, 'parsing duration years')
	assert.is(duration.month, -1, 'parsing duration months')
	assert.is(duration.day, -2, 'parsing duration days')
	assert.is(duration.hour, -3, 'parsing duration hours')
	assert.is(duration.minute, -4, 'parsing duration minutes')
	assert.is(duration.second, -5, 'parsing duration seconds')
})

test('parse week duration', assert => {
	assert.is(parseDuration('P1W').week, 1)
})

test('parse negative week duration', assert => {
	assert.is(parseDuration('-P1W').week, -1)
})

test('add / addUTC methods throws on invalid date', assert => {
	assert.throws(() => parseDuration('P1D').add('x'), TypeError, 'add method throws on invalid date')
	assert.throws(() => parseDuration('P1D').addUTC('x'), TypeError, 'addUTC method throws on invalid date')
})

test('addUTC duration method', assert => {
	const cetDate = 'Sun Mar 27 2016 01:00:00 GMT+0100 (CET)'
	const anHourLater = parseDuration('P1D')
	assert.true('function' === typeof anHourLater.addUTC, 'has addUTC method')
	const cetHourLater = anHourLater.addUTC(new Date(cetDate))
	assert.true(cetHourLater instanceof Date, 'addUTC method returns Date')
	assert.is(cetHourLater.toString(), 'Mon Mar 28 2016 02:00:00 GMT+0200 (CEST)', 'add duration according DST')
})

test('add duration method', assert => {
	const cetDate = 'Sun Mar 27 2016 01:00:00 GMT+0100 (CET)'
	const anHourLater = parseDuration('P1D')
	assert.true('function' === typeof anHourLater.add, 'has add method')
	const cetHourLater = anHourLater.add(new Date(cetDate))
	assert.true(cetHourLater instanceof Date, 'add method returns Date')
	assert.is(cetHourLater.toString(), 'Mon Mar 28 2016 01:00:00 GMT+0200 (CEST)', 'add duration but preserve day time')
})

test('addUTC duration method', assert => {
	const cetDate = 'Sun Mar 27 2016 01:00:00 GMT+0100 (CET)'
	const anHourLater = parseDuration('P1D')
	assert.true('function' === typeof anHourLater.addUTC, 'has addUTC method')
	const cetHourLater = anHourLater.addUTC(new Date(cetDate))
	assert.true(cetHourLater instanceof Date, 'addUTC method returns Date')
	assert.is(cetHourLater.toString(), 'Mon Mar 28 2016 02:00:00 GMT+0200 (CEST)', 'add duration according DST')
})

test('add method removes negative duration', assert => {
	const cetDate = 'Mon Mar 28 2016 01:00:00 GMT+0200 (CEST)'
	const anHourLater = parseDuration('-P1D')
	assert.true('function' === typeof anHourLater.add, 'has add method')
	const cetHourLater = anHourLater.add(new Date(cetDate))
	assert.true(cetHourLater instanceof Date, 'add method returns Date')
	assert.is(cetHourLater.toString(), 'Sun Mar 27 2016 01:00:00 GMT+0100 (CET)', 'remove duration but preserve day time')
})

test('addUTC method removes negative duration', assert => {
	const cetDate = 'Mon Mar 28 2016 02:00:00 GMT+0200 (CEST)'
	const anHourLater = parseDuration('-P1D')
	assert.true('function' === typeof anHourLater.addUTC, 'has addUTC method')
	const cetHourLater = anHourLater.addUTC(new Date(cetDate))
	assert.true(cetHourLater instanceof Date, 'addUTC method returns Date')
	assert.is(cetHourLater.toString(), 'Sun Mar 27 2016 01:00:00 GMT+0100 (CET)', 'remove duration according DST')
})
