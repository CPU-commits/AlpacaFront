export default defineNuxtRouteMiddleware(async (_to, from) => {
	if (!import.meta.server) return

	const event = useNuxtApp().ssrContext?.event

	let ipRaw =
		event?.node.req.headers['CF-Connecting-IP'] ??
		event?.node.req.headers['x-forwarded-for']
	if (Array.isArray(ipRaw)) {
		ipRaw = ipRaw[0]
	}

	const ip =
		typeof ipRaw === 'string'
			? ipRaw
			: (event?.node.req.socket.remoteAddress ?? '')

	const authStore = useAuthStore()
	const clientStore = useClientStore()
	clientStore.setIP(ip)

	let isAuth = true
	if (!authStore.isAuth) {
		const { session } = await useSession<AuthData>()
		if (session.value?.data?.accessToken) {
			authStore.setAuth({
				accessToken: session.value?.data.accessToken,
				user: session.value?.data.user,
				refreshToken: session.value?.data.refreshToken,
			})
		} else isAuth = false
	}
	const auth = _to.meta?.auth ?? false
	if (auth && !isAuth)
		return navigateTo({
			path: '/login',
			query: {
				redirect: from.path,
			},
		})
})
