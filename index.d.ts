declare module 'parseDuration' {
	export interface ParsedDuration {
		year: number;
		month: number;
		day: number;
		hour: number;
		minute: number;
		second:  number;
		week: number;
		addUTC(date: Date): Date;
		add(date: Date): Date;
	}
	export function parseDuration(duration: string): ParsedDuration;
}
