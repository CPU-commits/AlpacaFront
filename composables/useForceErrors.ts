export default function () {
	return useState(
		'forceErrors',
		() => null as null | { _id: string; namespace?: string },
	)
}
