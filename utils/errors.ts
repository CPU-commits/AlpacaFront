import { v4 } from 'uuid'

export class SpecificError extends Error {
	id: Array<string>

	constructor(error: string, ...id: Array<string>) {
		super(error)
		this.id = id
	}
}

export class FormError extends Error {}

export function clearSpecificError(id: string) {
	const errors = useFormErrors()

	errors.value.delete(id)
}

export function forceErrors(namespace?: string) {
	useForceErrors().value = {
		_id: v4(),
		namespace,
	}
}

export function stageHasError(stage: number) {
	for (const v of useFormErrors().value.values()) {
		if (v.stage === stage && v.hasErrors && v.errors.length > 0) return true
	}
	return false
}

export function throwIfFormHasError(namespace?: string) {
	forceErrors(namespace)
	for (const v of useFormErrors().value.values()) {
		if (v.hasErrors && (!namespace || namespace === v.namespace))
			throw new FormError('Error en el formulario')
	}
}

export function clearMultipleErrors(startWith: string) {
	const errors = useFormErrors()

	errors.value.forEach((_, key) => {
		if (key.startsWith(startWith)) errors.value.delete(key)
	})
}
