import { defineStore } from 'pinia'
import type { DefaultResponse } from '~~/common/fetchModule'
import type { UserTypes } from '~~/models/user/user.model'
import { formatUserType } from '~~/utils/format'

type KeysUserTypes = keyof typeof UserTypes

export interface AuthData {
	accessToken: string
	refreshToken: string
	user: {
		role: KeysUserTypes
		name: string
		id: number
	}
}

async function logIn(userForm: { rut: string; password: string }) {
	const { $fetchModule } = useNuxtApp()
	try {
		const dataFetch = await $fetchModule.fetchData<
			AuthData & DefaultResponse
		>({
			method: 'post',
			URL: '/api/auth/login',
			body: userForm,
			nuxt: true,
		})
		return dataFetch
	} catch {
		throw new Error('Credenciales inválidas')
	}
}

async function logOut() {
	const { remove } = await useSession()
	await remove()
}

const useAuthStore = defineStore('auth', {
	state: () => ({
		isAuth: false,
		user: null as AuthData | null,
	}),
	getters: {
		getIsAuth(state) {
			return state.isAuth
		},
		getUser(state): AuthData | null {
			return state.user
		},
		getToken(state): string | null {
			return state.user?.accessToken ?? null
		},
		getRole(state): KeysUserTypes | null {
			return state.user?.user.role ?? null
		},
		getName(state): string | null {
			return state.user?.user.name ?? null
		},
		getID(state): number | null {
			return state.user?.user.id ?? null
		},
		getRefreshToken(state): string | null {
			return state.user?.refreshToken ?? null
		},
		getUserTypeName(state) {
			if (!state.user?.user.role) return ''
			return formatUserType(state.user?.user.role)
		},
	},
	actions: {
		unsetAuth() {
			this.isAuth = false
			this.user = null
		},
		async logIn(userForm: { rut: string; password: string }) {
			const dataFetch = await logIn(userForm)
			await this.setAuth({
				user: dataFetch.user,
				accessToken: dataFetch.accessToken,
				refreshToken: dataFetch.refreshToken,
			})
		},
		async logOut() {
			await logOut()
			this.unsetAuth()
		},
		async setAuth(user: AuthData) {
			this.isAuth = true
			this.user = user

			const { overwrite } = await useSession()
			await overwrite(user)
		},
		userRoleNotIs(...userTypes: KeysUserTypes[]) {
			return !userTypes.includes(this.getRole as never)
		},
		userRoleIs(...userTypes: KeysUserTypes[]) {
			return userTypes.includes(this.getRole as never)
		},
	},
})

export default useAuthStore
