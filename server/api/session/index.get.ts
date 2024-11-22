import { COOKIE_SESSION } from '~/common/cookies'
import type { Session } from '~/models/session/session'
import { storage } from '~/server/utils/storage'
import type { AuthData } from '~/stores/useAuthStore'

export default defineEventHandler(
	async (event): Promise<Session<AuthData> | null> => {
		const cookieSession = getCookie(event, COOKIE_SESSION)
		if (!cookieSession || cookieSession === 'undefined') return null

		// Descrypt and send session
		const decryptedId = decrypt(cookieSession)

		const session = await storage.getItem<Session<AuthData>>(decryptedId)
		if (!session) return null

		return session
	},
)
