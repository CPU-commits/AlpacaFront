export default defineNuxtRouteMiddleware(async (_to, from) => {
	if (!import.meta.server) return
	let isAuth = true
	if (!useAuthStore().isAuth) {
		const { session } = await useSession<AuthData>()
		if (session.value?.data?.accessToken) {
			useAuthStore().setAuth({
				accessToken: session.value?.data.accessToken,
				user: session.value?.data.user,
				refreshToken: session.value?.data.refreshToken,
			})
		} else isAuth = false
	}
	const auth = _to.meta?.auth ?? true
	if (auth && !isAuth)
		return navigateTo({
			path: '/login',
			query: {
				redirect: from.path,
			},
		})
})
