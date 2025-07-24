import { defineStore } from 'pinia'

const useClientStore = defineStore('client', {
	state: () => ({
		ip: '' as string,
		identifier: '',
	}),
	getters: {
		getIP(state) {
			return state.ip
		},
		getIdentifier(state) {
			return state.identifier
		},
	},
	actions: {
		setIP(ip: string) {
			this.ip = ip

			if (this.identifier === '') this.identifier = ip
		},
		setIdentifier(identifier: string) {
			this.identifier = identifier
		},
	},
})

export default useClientStore
