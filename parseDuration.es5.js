(function (name, definition) {
	if (typeof module != 'undefined') module.exports = definition();
	else if (typeof define == 'function' && typeof define.amd == 'object') define(name, [], definition);
	else this[name] = definition();
}('parseDuration', function () {
	/**
	 * Parse ISO 8601 duration (with a few limitations)
	 *
	 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
	 *
	 * @example
	 * var aDayAgo = parseDuration('-P1D').add, yesterday = aDayAgo(new Date());
	 *
	 * @param {String} duration: ISO 8601 duration, only in "PnYnMnDTnHnMnS" or "PnW" formats, n being an integer
	 * @throws {Error} When duration cannot be parsed
	 * @returns {Function} That sums or substracts parsed duration to a given date, accorging duration sign
	 */
	// see
	var durationRegex = /^(-)?P(?:(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?|(\d+)W)$/;
	return function parseDuration (duration) {
		var parsed;
		duration && duration.replace(durationRegex, function (_, sign, year, month, day, hour, minute, second, week) {
			sign = sign ? -1 : 1;
			// parse number for each unit
			var units = [year, month, day, hour, minute, second, week].map(function (num) { return parseInt(num, 10) * sign || 0; });
			parsed = {year: units[0], month: units[1], week: units[6], day: units[2], hour: units[3], minute: units[4], second: units[5]};
		});
		// no regexp match
		if (!parsed) { throw new Error('Invalid duration "' + duration + '"'); }
		/**
		 * Sum or substract parsed duration to date
		 *
		 * @param {Date} date: A valid date instance
		 * @throws {TypeError} When date is not valid
		 * @returns {Date} Date plus or minus duration, according duration sign
		 */
		parsed.add = function add (date) {
			if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.valueOf())) {
				throw new TypeError('Invalide date');
			}
			return new Date(Date.UTC(
				date.getUTCFullYear() + parsed.year,
				date.getUTCMonth() + parsed.month,
				date.getUTCDate() + parsed.day + parsed.week * 7,
				date.getUTCHours() + parsed.hour,
				date.getUTCMinutes() + parsed.minute,
				date.getUTCSeconds() + parsed.second,
				date.getUTCMilliseconds()
			));
		};
		return parsed;
	};
}));
