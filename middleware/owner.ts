export default defineNuxtRouteMiddleware(async (to) => {
	const auth = useAuthStore()
	const username = to.params.nickname as string
	if (auth.getIsAuth) {
		if (username) await auth.isOwnerFunc({ userName: username })
		if (!auth.isOwner)
			return navigateTo({
				path: '/401',
			})
	}
})
