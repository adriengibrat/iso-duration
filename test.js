import test from 'ava'
import parseDuration from './parseDuration'

test('throws on invalid duration', assert => {
	assert.throws(() => parseDuration('X'), Error)
})

test('parse simple duration', assert => {
	assert.is(parseDuration('P1Y').year, 1, 'parsing simple year duration')
	assert.is(parseDuration('P1M').month, 1, 'parsing simple month duration')
	assert.is(parseDuration('P1D').day, 1, 'parsing simple day duration')
	assert.is(parseDuration('PT1H').hour, 1, 'parsing simple hour duration')
	assert.is(parseDuration('PT1M').minute, 1, 'parsing simple minute duration')
	assert.is(parseDuration('PT1S').second, 1, 'parsing simple second duration')
})

test('parse complex duration', assert => {
	const duration = parseDuration('P1M2DT3H4M5S')
	assert.is(duration.year, 0, 'parsing complex duration year')
	assert.is(duration.month, 1, 'parsing complex duration month')
	assert.is(duration.day, 2, 'parsing complex duration day')
	assert.is(duration.hour, 3, 'parsing complex duration hour')
	assert.is(duration.minute, 4, 'parsing complex duration minute')
	assert.is(duration.second, 5, 'parsing complex duration second')
})

test('parse simple negative duration', assert => {
	assert.is(parseDuration('-P1Y').year, -1, 'parsing simple year duration')
	assert.is(parseDuration('-P1M').month, -1, 'parsing simple month duration')
	assert.is(parseDuration('-P1D').day, -1, 'parsing simple day duration')
	assert.is(parseDuration('-PT1H').hour, -1, 'parsing simple hour duration')
	assert.is(parseDuration('-PT1M').minute, -1, 'parsing simple minute duration')
	assert.is(parseDuration('-PT1S').second, -1, 'parsing simple second duration')
})

test('parse complex negative duration', assert => {
	const duration = parseDuration('-P1M2DT3H4M5S')
	assert.is(duration.year, 0, 'parsing complex duration year')
	assert.is(duration.month, -1, 'parsing complex duration month')
	assert.is(duration.day, -2, 'parsing complex duration day')
	assert.is(duration.hour, -3, 'parsing complex duration hour')
	assert.is(duration.minute, -4, 'parsing complex duration minute')
	assert.is(duration.second, -5, 'parsing complex duration second')
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
