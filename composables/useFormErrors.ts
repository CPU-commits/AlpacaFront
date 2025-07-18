export default function () {
	return useState(
		'formError',
		() =>
			new Map<
				string,
				{
					hasErrors: boolean
					stage?: number
					errors: Array<string>
					namespace?: string
				}
			>(),
	)
}
