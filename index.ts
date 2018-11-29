/**
 * Sum parsed ISO 8601 duration to given date
 *
 * @function ISOduration
 * @param {Date} date Date to add duration to
 * @param {ISOdurationOptions} [options] Default { strict: false, substract: false }
 * @param {boolean} [options.strict] Default: false
 * @param {boolean} [options.substract] Default: false
 * @returns {Date} Date with duration added (or substracted when duration is negative or options.substract true)
 * @mixes ParsedISOduration
 */
export interface ISOduration extends ParsedISOduration {
	(date: Date, options?: ISOdurationOptions): Date
}

/**
 * Duration parser options
 *
 * @typedef ISOdurationOptions
 * @param {boolean} [strict] When true: date time may be affected by daylight saving time (DST) but interval are strictly equal to duration
 * @param {boolean}[substract] When true, duration (positive or negative) will always be substacted to date
 */
interface ISOdurationOptions {
	strict?: boolean
	substract?: boolean 
}

/**
 * Parsed ISO 8601 duration
 *
 * @mixin ParsedISOduration
 * @property {number} year
 * @property {number} month
 * @property {number} week
 * @property {number} day
 * @property {number} hour
 * @property {number} minute
 * @property {number} second
 * @property {boolean} negative
 */
interface ParsedISOduration extends Readonly<Record<'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second', number>> {
	readonly negative: boolean
}

/**
 * Parse ISO 8601 duration
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations ISO 8601 duration explained
 * @function duration
 * @param {String} ISOduration ISO 8601 duration, in "PnYnMnDTnHnMnS" or "PnW" formats, n being an integer
 * @throws {Error} When duration cannot be parsed
 * @returns {IsoDuration} Function that sum parsed duration to a given date
 * @example
 * const today = new Date()
 * const dayBefore = duration('-P1D')
 * const { negative, day } = dayBefore // read parsed duration (negative === true, day === 1)
 * const yesterday = dayBefore(today) // sum duration to date
 */
export function duration (ISOduration: string): ISOduration {
	const parsed: ParsedISOduration = parse(ISOduration)
	const options: ISOdurationOptions = { strict: false, substract: false }
	return Object.assign((date: Date, { strict, substract }: ISOdurationOptions = options) => {
		check(date)
		const { year, month, week, day, hour, minute, second } =
			substract && !parsed.negative ? map(num(-1), parsed) : parsed
		if (strict)
			return new Date(Date.UTC(
				date.getUTCFullYear() + year,
				date.getUTCMonth() + month,
				date.getUTCDate() + day + week * 7,
				date.getUTCHours() + hour,
				date.getUTCMinutes() + minute,
				date.getUTCSeconds() + second,
				date.getUTCMilliseconds()
			))
		return new Date(
			date.getFullYear() + year,
			date.getMonth() + month,
			date.getDate() + day + week * 7,
			date.getHours() + hour,
			date.getMinutes() + minute,
			date.getSeconds() + second,
			date.getMilliseconds()
		)
	}, parsed)
}

const check = (date: Date) => {
	if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.valueOf()))
		throw new TypeError(`Invalid date "${date}"`)
}

type Mapper<V, M> = (value: V) => M

type Mapped<T, M> = { [P in keyof T]: M }

const map = <O, M>(mapper: Mapper<O[keyof O], M>, object: O): Mapped<O, M> => {
	const target = {} as Mapped<O, M>
	for (let key in object) target[key] = mapper(object[key])
	return target
}

const num = (multiplier: number) => (num: any) => parseInt(num, 10) * multiplier || 0

const parse = (duration: string): ParsedISOduration => {
	let parsed: ParsedISOduration
	if (duration)
		duration.replace(
			/^(-)?P(?:(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?|(\d+)W)$/,
			(_, sign, year, month, day, hour, minute, second, week) => {
				const negative = !!sign
				parsed = { negative, ...map(num(negative ? -1 : 1), { year, month, day, hour, minute, second, week }) }
				return ''
			},
		)
	if (!parsed)
		throw new Error(`Invalid duration "${duration}"`)
	return Object.freeze(parsed)
}
