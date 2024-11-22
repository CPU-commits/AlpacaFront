export default function () {
	return useState('scopespinner', () => new Map<string, boolean>())
}
