type Callback = () => void

const callbacks = new Set<Callback>()

let initialized = false

function handler() {
	callbacks.forEach((cb) => cb())
}

export default function useResizeBus(callback: Callback) {
	if (!initialized && import.meta.client) {
		window.addEventListener('resize', handler)
		initialized = true
	}

	callbacks.add(callback)

	onBeforeUnmount(() => {
		callbacks.delete(callback)
		if (callbacks.size === 0 && import.meta.client) {
			window.removeEventListener('resize', handler)
			initialized = false
		}
	})
}
