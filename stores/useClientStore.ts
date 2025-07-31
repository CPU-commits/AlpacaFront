import { defineStore } from 'pinia'

const useClientStore = defineStore('client', {
	state: () => ({
		ip: '' as string,
		identifier: '',
		identifierType: '' as string,
	}),
	getters: {
		getIP(state) {
			return state.ip
		},
		getIdentifier(state) {
			return state.identifier
		},
		getIdentifierType(state) {
			return state.identifierType
		},
	},
	actions: {
		setIP(ip: string) {
			this.ip = ip
			this.identifierType = 'ip'

			if (this.identifier === '') this.identifier = ip
		},
		setIdentifier(identifier: string, identifierType: string) {
			this.identifier = identifier
			this.identifierType = identifierType
		},
	},
})

export default useClientStore
