export default defineNuxtRouteMiddleware(async (to) => {
	const auth = useAuthStore()
	const username = to.params.nickname as string
	if (auth.isAuth) {
		if (username) await auth.isOwnerFunc({ userName: username })
		if (!auth.isOwner)
			throw createError({
				statusCode: 401,
				statusMessage: 'Unauthorized',
			})
	}
})
