/**
 * Parse ISO 8601 duration (with few limitations)
 *
 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations ISO 8601 duration explained
 *
 * @see https://gist.github.com/adriengibrat/e0b6d16cdd8c584392d8 Previous history
 *
 * @example
 * const aDayAgo = parseDuration('-P1D').add, yesterday = aDayAgo(new Date())
 *
 * @param {String} duration: ISO 8601 duration, only in "PnYnMnDTnHnMnS" or "PnW" formats, n being an integer
 * @throws {Error} When duration cannot be parsed
 * @returns {Object} Parsed duration with "add" method that sums or substracts parsed duration to a given date, accorging duration sign
 */

const checkDate = date => {
	if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.valueOf()))
		throw new TypeError('Invalide date')
}

const map = (mapper, object) => {
	const target = {}
	for (let key in object)
		if (object.hasOwnProperty(key))
			target[key] = mapper(object[key], key, object)
	return target
}

const durationRegex = /^(-)?P(?:(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?|(\d+)W)$/

export function parseDuration (duration) {
	let parsed

	if (duration)
		duration.replace(durationRegex, (_, sign, year, month, day, hour, minute, second, week) => {
			sign = sign ? -1 : 1
			const toNumber = num => parseInt(num, 10) * sign || 0
			parsed = map(toNumber, { year, month, day, hour, minute, second, week })
		})

	if (!parsed)
		throw new Error(`Invalid duration "${duration}"`)

	return Object.assign(parsed, {
		/**
		 * Sum or substract parsed duration to given date using UTC logic
		 * Time in the day may be affected by daylight saving time (DST)
		 * Time interval between the date given and returned will be stricly equal to duration
		 *
		 * @param {Date} date: Any valid date
		 * @throws {TypeError} When date is not valid
		 * @returns {Date} New date with duration difference
		 */
		addUTC(date) {
			checkDate(date);
			return new Date(Date.UTC(
				date.getUTCFullYear() + parsed.year,
				date.getUTCMonth() + parsed.month,
				date.getUTCDate() + parsed.day + parsed.week * 7,
				date.getUTCHours() + parsed.hour,
				date.getUTCMinutes() + parsed.minute,
				date.getUTCSeconds() + parsed.second,
				date.getUTCMilliseconds()
			))
		},

		/**
		 * Sum or substract parsed duration to date
		 * Time in the day won't be affected by daylight saving time (DST)
		 * Time interval between the date given and returned may be affected by DST and not equal to duration
		 *
		 * @param {Date} date: Any valid date
		 * @throws {TypeError} When date is not valid
		 * @returns {Date} New date with duration difference
		 */
		add(date) {
			checkDate(date);
			return new Date(
				date.getFullYear() + parsed.year,
				date.getMonth() + parsed.month,
				date.getDate() + parsed.day + parsed.week * 7,
				date.getHours() + parsed.hour,
				date.getMinutes() + parsed.minute,
				date.getSeconds() + parsed.second,
				date.getMilliseconds()
			)
		}
	})
}
