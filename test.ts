import { duration } from './index'

test('throws on invalid duration', () => {
	expect(() => duration('X')).toThrowError(Error)
	expect(() => duration(0 as any)).toThrowError(Error)
	expect(() => duration(new Date() as any)).toThrowError(Error)
	expect(() => duration(new Date('X') as any)).toThrowError(Error)
})

test('parse simple durations', () => {
	expect(duration('P1Y').negative).toBe(false)
	expect(duration('P1Y').year).toBe(1)
	expect(duration('P1M').negative).toBe(false)
	expect(duration('P1M').month).toBe(1)
	expect(duration('P1W').negative).toBe(false)
	expect(duration('P1W').week).toBe(1)
	expect(duration('P1D').negative).toBe(false)
	expect(duration('P1D').day).toBe(1)
	expect(duration('PT1H').negative).toBe(false)
	expect(duration('PT1H').hour).toBe(1)
	expect(duration('PT1M').negative).toBe(false)
	expect(duration('PT1M').minute).toBe(1)
	expect(duration('PT1S').negative).toBe(false)
	expect(duration('PT1S').second).toBe(1)
})

test('parse simple negative durations', () => {
	expect(duration('-P1Y').negative).toBe(true)
	expect(duration('-P1Y').year).toBe(-1)
	expect(duration('-P1M').negative).toBe(true)
	expect(duration('-P1M').month).toBe(-1)
	expect(duration('-P1W').negative).toBe(true)
	expect(duration('-P1W').week).toBe(-1)
	expect(duration('-P1D').negative).toBe(true)
	expect(duration('-P1D').day).toBe(-1)
	expect(duration('-PT1H').negative).toBe(true)
	expect(duration('-PT1H').hour).toBe(-1)
	expect(duration('-PT1M').negative).toBe(true)
	expect(duration('-PT1M').minute).toBe(-1)
	expect(duration('-PT1S').negative).toBe(true)
	expect(duration('-PT1S').second).toBe(-1)

})

test('parse complex duration', () => {
	const d = duration('P1M2DT3H90M200S')
	expect(d.negative).toBe(false)
	expect(d.year).toBe(0)
	expect(d.month).toBe(1)
	expect(d.day).toBe(2)
	expect(d.hour).toBe(3)
	expect(d.minute).toBe(90)
	expect(d.second).toBe(200)
})


test('parse complex negative duration', () => {
	const d = duration('-P1M2DT3H4M5S')
	expect(d.negative).toBe(true)
	expect(d.year).toBe(0)
	expect(d.month).toBe(-1)
	expect(d.day).toBe(-2)
	expect(d.hour).toBe(-3)
	expect(d.minute).toBe(-4)
	expect(d.second).toBe(-5)
})

test('sum throws on invalid date', () => {
	const x = new Date('x')
	expect(() => duration('P1D')(x)).toThrowError(TypeError)
	expect(() => duration('P1D')(x, { strict: true })).toThrowError(TypeError)
	expect(() => duration('P1D')(x, { strict: true, substract: true })).toThrowError(TypeError)
})

test('sum duration', () => {
	const aDayLater = duration('P1D')
	// winter time -> summer time (change sunday @ 02:00:00)
	const cetDate = new Date('Sun Mar 27 2016 01:00:00 (Europe/Paris)')
	expect(cetDate.toUTCString()).toBe('Sun, 27 Mar 2016 00:00:00 GMT')
	const cetDayLater = aDayLater(cetDate) // Mon Mar 28 2016 01:00:00 (Europe/Paris)
	expect(cetDayLater.toUTCString()).toBe('Sun, 27 Mar 2016 23:00:00 GMT')
})

test('strict sum duration', () => {
	const aDayLater = duration('P1D')
	// winter time -> summer time (change sunday @ 02:00:00)
	const cetDate = new Date('Sun Mar 27 2016 01:00:00 (Europe/Paris)')
	expect(cetDate.toUTCString()).toBe('Sun, 27 Mar 2016 00:00:00 GMT')
	const cetDayLater = aDayLater(cetDate, { strict: true }) // Mon Mar 28 2016 02:00:00 (Europe/Paris)
	expect(cetDayLater.toUTCString()).toBe('Mon, 28 Mar 2016 00:00:00 GMT')
})

test('sum negative duration', () => {
	const aDayBefore = duration('-P1D')
	// summer time -> winter time (change sunday @ 02:00:00)
	const cestDate = new Date('Sun, 27 Mar 2016 23:00:00 (Europe/Paris)')
	expect(cestDate.toUTCString()).toBe('Sun, 27 Mar 2016 21:00:00 GMT')
	const cetDayBefore = aDayBefore(cestDate) // Sat Mar 26 2016 23:00:00 (Europe/Paris)
	expect(cetDayBefore.toUTCString()).toBe('Sat, 26 Mar 2016 22:00:00 GMT')
})

test('sum strict negative duration', () => {
	const aDayBefore = duration('-P1D')
	// summer time -> winter time (change sunday @ 02:00:00)
	const cestDate = new Date('Sun, 27 Mar 2016 23:00:00 (Europe/Paris)')
	expect(cestDate.toUTCString()).toBe('Sun, 27 Mar 2016 21:00:00 GMT')
	const cetDayBefore = aDayBefore(cestDate, { strict: true }) // Sat Mar 26 2016 22:00:00 (Europe/Paris)
	expect(cetDayBefore.toUTCString()).toBe('Sat, 26 Mar 2016 21:00:00 GMT')
})

test('substract duration', () => {
	const aDay = duration('P1D')
	// summer time -> winter time (change sunday @ 02:00:00)
	const cestDate = new Date('Sun, 27 Mar 2016 23:00:00 (Europe/Paris)')
	expect(cestDate.toUTCString()).toBe('Sun, 27 Mar 2016 21:00:00 GMT')
	const cetDayBefore = aDay(cestDate, { substract: true }) // Sat Mar 26 2016 23:00:00 (Europe/Paris)
	expect(cetDayBefore.toUTCString()).toBe('Sat, 26 Mar 2016 22:00:00 GMT')
	const aDayBefore = duration('-P1D')
	const alsoCetDayBefore = aDayBefore(cestDate, { substract: true }) // Sat Mar 26 2016 23:00:00 (Europe/Paris)
	expect(alsoCetDayBefore.toUTCString()).toBe('Sat, 26 Mar 2016 22:00:00 GMT')

})

test('substract strict duration', () => {
	const aDay = duration('P1D')
	// summer time -> winter time (change sunday @ 02:00:00)
	const cestDate = new Date('Sun, 27 Mar 2016 23:00:00 (Europe/Paris)')
	const cetDayBefore = aDay(cestDate, { substract: true, strict: true }) // Sat Mar 26 2016 22:00:00 (Europe/Paris)
	expect(cestDate.toUTCString()).toBe('Sun, 27 Mar 2016 21:00:00 GMT')
	expect(cetDayBefore.toUTCString()).toBe('Sat, 26 Mar 2016 21:00:00 GMT')
	const aDayBefore = duration('-P1D')
	const alsoCetDayBefore = aDayBefore(cestDate, { substract: true, strict: true }) // Sat Mar 26 2016 22:00:00 (Europe/Paris)
	expect(alsoCetDayBefore.toUTCString()).toBe('Sat, 26 Mar 2016 21:00:00 GMT')
})
