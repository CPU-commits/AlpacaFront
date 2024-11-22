// Fetch
import type { DefaultResponse } from '~~/common/fetchModule'
// Types
import type { AuthData } from '~~/stores/useAuthStore'

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event)
		// Get authData
		const dataFetch = await $fetch<AuthData & DefaultResponse>(
			'api/authentication',
			{
				body,
				method: 'post',
				baseURL: useRuntimeConfig().public.API,
			},
		)

		return dataFetch
	} catch (err) {
		throw createError(err as Error)
	}
})
