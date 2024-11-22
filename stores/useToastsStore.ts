import { defineStore } from 'pinia'
import type { Toast } from '~~/models/toast/toast.model'

const useToastsStore = defineStore('toats', {
	state() {
		return {
			toasts: [] as Array<Toast & { id: number }>,
			counter: 0,
		}
	},
	getters: {
		getToasts(state) {
			return state.toasts
		},
	},
	actions: {
		dismissToast(id: number) {
			this.toasts = this.toasts.filter((toast) => toast.id !== id)
		},
		addToast(toast: Toast) {
			this.counter += 1
			const id = this.counter
			const defaults = {
				id,
				type: 'info',
				dismissible: true,
				timeout: 4000,
			}
			const t = { ...defaults, ...toast }
			this.toasts.push(t)
			if (t.timeout) setTimeout(() => this.dismissToast(id), t.timeout)
		},
	},
})

export default useToastsStore
