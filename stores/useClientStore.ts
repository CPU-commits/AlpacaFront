import { defineStore } from 'pinia'

export const useClientStore = defineStore('client', {
	state: () => ({
		ip: '' as string,
	}),
	getters: {
		getIP(state) {
			return state.ip
		},
	},
	actions: {
		setIP(ip: string) {
			this.ip = ip
		},
	},
})
