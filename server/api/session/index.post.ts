import { randomUUID } from 'crypto'
import { COOKIE_SESSION } from '~/common/cookies'
import type { Session } from '~/models/session/session'
import { setSession } from '~/server/utils/cookies'

export default defineEventHandler(async (event): Promise<Session> => {
	const body = await readBody(event)
	const cookieSession = getCookie(event, COOKIE_SESSION)
	// Redis
	let uid: string

	if (cookieSession) uid = decrypt(cookieSession)
	else uid = randomUUID()

	const session = {
		createdAt: new Date(),
		data: body,
		uid,
	} as Session

	await setSession(uid, JSON.stringify(session), event)
	return session
})
