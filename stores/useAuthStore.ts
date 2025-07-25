import { defineStore } from 'pinia'
import type { DefaultResponse } from '~~/common/fetchModule'
import type { User, UserTypesKeys } from '~~/models/user/user.model'
import { formatUserType } from '~~/utils/format'

export interface AuthData {
	accessToken: string
	refreshToken: string
	user: User
}

async function logIn(userForm: { username: string; password: string }) {
	const { $fetchModule } = useNuxtApp()
	try {
		const dataFetch = await $fetchModule.fetchData<
			AuthData & DefaultResponse
		>({
			method: 'post',
			URL: '/api/auth/login',
			body: userForm,
		})
		return dataFetch
	} catch {
		throw new Error('Credenciales inválidas')
	}
}
async function isOwner(params?: { userName?: string; id?: number }) {
	const { $fetchModule } = useNuxtApp()
	const authStore = useAuthStore()

	try {
		await $fetchModule.fetchData({
			method: 'get',
			URL: '/api/auth',
			params: params,
			token: authStore.getToken,
		})
		return true
	} catch (e) {
		console.log(e)
		return false
	}
}

async function logOut() {
	const { remove } = await useSession()
	await remove()
}

const useAuthStore = defineStore('auth', {
	state: () => ({
		isAuth: false,
		isOwner: false,
		user: null as AuthData | null,
	}),
	getters: {
		getIsAuth(state) {
			return state.isAuth
		},
		getUser(state): AuthData | null {
			return state.user
		},
		getUsername(state) {
			return state.user?.user.username ?? null
		},
		getToken(state): string | null {
			return state.user?.accessToken ?? null
		},
		getRoles(state): Array<UserTypesKeys> | null {
			return state.user?.user.roles ?? null
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
		isOwnProfile(state) {
			if (!state.user) return false
			return useRoute().path.startsWith(
				`/${state.user?.user.username ?? ''}`,
			)
		},
	},
	actions: {
		unsetAuth() {
			this.isAuth = false
			this.user = null
		},
		async logIn(userForm: { username: string; password: string }) {
			const dataFetch = await logIn(userForm)
			await this.setAuth({
				user: dataFetch.user,
				accessToken: dataFetch.accessToken,
				refreshToken: dataFetch.refreshToken,
			})
			return dataFetch.user.username
		},
		async isOwnerFunc(params?: { id?: number; userName?: string }) {
			const res = await isOwner(params)
			await this.setOwner(res)
		},
		async logOut() {
			await logOut()
			this.unsetAuth()
			useRouter().push('/')
		},
		async setOwner(isOwner: boolean) {
			this.isOwner = isOwner
		},
		async setAuth(user: AuthData) {
			this.isAuth = true
			this.user = user

			useClientStore().setIdentifier(user.user.id.toString(), 'id')
			const { overwrite } = await useSession()
			await overwrite(user)
		},
		userRoleNotIs(...userTypes: UserTypesKeys[]) {
			return !userTypes.some((role) => this.getRoles?.includes(role))
		},
		userRoleIs(...userTypes: UserTypesKeys[]) {
			return userTypes.some((role) => this.getRoles?.includes(role))
		},
	},
})

export default useAuthStore
