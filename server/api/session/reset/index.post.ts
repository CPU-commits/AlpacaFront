import { randomUUID } from 'crypto'
import { COOKIE_SESSION } from '~/common/cookies'
import type { Session } from '~/models/session/session'

export default defineEventHandler(async (event) => {
	const cookieSession = getCookie(event, COOKIE_SESSION)

	const uid = randomUUID()
	const session = {
		createdAt: new Date(),
		data: undefined,
		uid,
	} as Session
	if (!cookieSession) {
		await setSession(uid, JSON.stringify(session), event)
	} else {
		await setSession(decrypt(cookieSession), JSON.stringify(session), event)
	}

	return session
})
