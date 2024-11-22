import dayjs from 'dayjs'

export function differentDates(
	dateOne: string | Date,
	dateTwo: string | Date,
): boolean {
	return dayjs(dateOne).diff(dateTwo) !== 0
}

export function dateIsAfter(
	dateOne: string | Date,
	dateTwo: string | Date,
): boolean {
	return dayjs(dateOne).isAfter(dateTwo)
}

export function dateIsBefore(
	dateOne: string | Date,
	dateTwo: string | Date,
): boolean {
	return dayjs(dateOne).isBefore(dateTwo)
}

export function dayStringToNumber(day: string) {
	if (day === 'Lunes') return 0
	if (day === 'Martes') return 1
	if (day === 'Miércoles') return 2
	if (day === 'Jueves') return 3
	if (day === 'Viernes') return 4
	if (day === 'Sábado') return 5
	return 6
}
