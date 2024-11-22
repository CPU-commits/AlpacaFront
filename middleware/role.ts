export default defineNuxtRouteMiddleware((to) => {
	if (!import.meta.server) return
	const auth = useAuthStore()
	const roles = to.meta.roles
	if (roles instanceof Array) {
		if (!roles.includes(auth.getRole))
			return abortNavigation({
				statusCode: 401,
				message: 'No estás autorizado a esta ruta',
			})
	} else {
		return abortNavigation({
			statusCode: 506,
			message: 'meta.roles no es válido',
		})
	}
})
