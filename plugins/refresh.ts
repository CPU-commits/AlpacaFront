import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'

let isRefreshStart = false
let timeoutInstance: NodeJS.Timeout | null = null

function refreshSession(executeInMs: number) {
	return setTimeout(async () => {
		const authStore = useAuthStore()
		const runtimeConfig = useRuntimeConfig()

		try {
			const res = await $fetch<AuthData>(
				`${runtimeConfig.public.API}/api/auth/refresh`,
				{
					method: 'POST',
					headers: {
						'X-Refresh': `Bearer ${authStore.getRefreshToken}`,
					},
				},
			)
			authStore.setAuth(res)
			// Rexecute
			const decoded = jwtDecode(res.accessToken)
			const diff = dayjs(new Date((decoded.exp ?? 0) * 1000)).diff(
				new Date(),
				'milliseconds',
			)

			timeoutInstance = refreshSession(diff - 60 * 5 * 1000)
		} catch {
			await authStore.logOut()
		}
	}, executeInMs)
}

function startRefresh(isAuth: boolean) {
	if (isAuth && !timeoutInstance) {
		isRefreshStart = true
		// Manage refresh token
		const decoded = jwtDecode(useAuthStore().getToken ?? '')

		const diff = dayjs(new Date((decoded.exp ?? 0) * 1000)).diff(
			new Date(),
			'milliseconds',
		)
		const executeIn = diff - 60 * 5 * 1000
		if (executeIn <= 0) timeoutInstance = refreshSession(0)
		else if (executeIn <= 1000 * 60 * 60 * 24 * 2)
			timeoutInstance = refreshSession(diff - 60 * 5 * 1000)
	}
}

export default defineNuxtPlugin({
	setup() {
		if (import.meta.server) return
		startRefresh(useAuthStore().isAuth)

		watch(
			() => useAuthStore().isAuth,
			(isAuth) => {
				if (!isRefreshStart) startRefresh(isAuth)
			},
		)
	},
})
