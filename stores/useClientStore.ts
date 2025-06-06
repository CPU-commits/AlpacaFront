import { defineStore } from 'pinia'

const useClientStore = defineStore('client', {
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

export default useClientStore
