export const minLength = (min: number) =>
	min === 1 ? `Requerido` : `Mínimo ${min} cárac.`

export const minArrayLength = (min: number) =>
	`Mínimo ${min} elemento${min > 1 ? 's' : ''}`

export const maxLength = (max: number) => `Máximo ${max} cáracteres`

export const isEmail = 'Ingrese un email válido'

export const isHttpUrl = 'Ingrese un link válido'

export const isRut = 'Ingrese un rut válido (Ej: 1111111-1)'

export const isURL = 'Ingrese un link válido'

export const isDatetime = 'Debe escoger una fecha y hora válida'

export const isInt = 'Debe ser un número entero'

export const min = (min: number) => `El valor mínimo es ${min}`

export const max = (max: number) => `El valor máximo es ${max}`

export const gt = (minValue: number) => `Debe ser mayor a ${minValue}`

export const lt = (maxValue: number) => `Debe ser menor a ${maxValue}`
