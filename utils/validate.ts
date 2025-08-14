const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function validate(
	value: string | Array<File> | object | null,
	id: string,
	validators?: {
		required?: boolean
		maxLength?: number
		stage?: number
		url?: boolean
		minLength?: number
		httpUrl?: boolean
		min?: number
		email?: boolean
		regex?: Array<{
			rule: RegExp
			message: string
			match: boolean
		}>
	} | null,
	returnMode = false,
) {
	// Composables
	const formErrors = useFormErrors()
	const inputRegistered = formErrors.value.get(id)
	if (!inputRegistered && !returnMode) return
	if (inputRegistered) inputRegistered.errors = []
	const hasLength = typeof value === 'string' || value instanceof Array
	const hasMin = typeof value === 'string'

	let hasErrors = false
	if (
		validators?.required &&
		(value === '' || (hasLength && value?.length === 0) || !value)
	) {
		if (!returnMode && inputRegistered)
			inputRegistered.errors.push(minLength(1))

		hasErrors = true
	}
	if (
		hasLength &&
		validators?.minLength &&
		value?.length < validators.minLength
	) {
		if (!returnMode && inputRegistered)
			inputRegistered.errors.push(minLength(validators.minLength))

		hasErrors = true
	}
	if (
		hasLength &&
		validators?.maxLength &&
		value?.length > validators.maxLength
	) {
		if (!returnMode && inputRegistered)
			inputRegistered.errors.push(maxLength(validators.maxLength))

		hasErrors = true
	}
	if (
		validators?.httpUrl &&
		typeof value === 'string' &&
		!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value)
	) {
		if (!returnMode && inputRegistered)
			inputRegistered.errors.push(isHttpUrl)

		hasErrors = true
	}
	if (validators?.regex && typeof value === 'string')
		validators.regex.forEach(({ rule, message, match }) => {
			const test = rule.test(value)
			if (test === match) {
				if (!returnMode && inputRegistered)
					inputRegistered.errors.push(message)
				hasErrors = true
			}
		})
	if (
		validators?.url &&
		typeof value === 'string' &&
		!isValidHttpUrl(value)
	) {
		if (!returnMode && inputRegistered) inputRegistered.errors.push(isURL)

		hasErrors = true
	}
	if (
		validators?.email &&
		typeof value === 'string' &&
		!regexEmail.test(value)
	) {
		if (!returnMode && inputRegistered) inputRegistered.errors.push(isEmail)

		hasErrors = true
	}

	if (
		hasMin &&
		validators?.min != undefined &&
		typeof value === 'string' &&
		parseInt(value, 10) < validators.min
	) {
		if (!returnMode && inputRegistered)
			inputRegistered.errors.push(min(validators.min))

		hasErrors = true
	}

	if (!returnMode && inputRegistered) inputRegistered.hasErrors = hasErrors
	else return hasErrors
}
