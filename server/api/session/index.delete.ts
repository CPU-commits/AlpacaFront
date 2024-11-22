import { COOKIE_SESSION } from '~/common/cookies'
import { storage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
	const cookieSession = getCookie(event, COOKIE_SESSION)
	if (!cookieSession)
		return {
			success: true,
		}

	// Descrypt and send session
	const decryptedId = decrypt(cookieSession)

	await storage.removeItem(decryptedId)
	deleteCookie(event, COOKIE_SESSION)

	return {
		success: true,
	}
})
