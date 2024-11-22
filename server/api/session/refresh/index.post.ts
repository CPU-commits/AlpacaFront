import { COOKIE_SESSION } from '@/common/cookies'
import { setSession } from '@/server/utils/cookies'
import { storage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
	const cookieSession = getCookie(event, COOKIE_SESSION)
	if (!cookieSession) return {}

	// Descrypt and send session
	const decryptedId = decrypt(cookieSession)

	// Extend session
	const session = (await storage.getItem(decryptedId)) as string

	return await setSession(decryptedId, session, event)
})
