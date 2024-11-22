import { randomUUID } from 'crypto'
import { setSession } from '../utils/cookies'
import type { Session } from '@/models/session/session'
import { COOKIE_SESSION } from '@/common/cookies'

export default defineEventHandler(async (event) => {
	// Create cookie if not exists
	const session = getCookie(event, COOKIE_SESSION)

	if (!session) {
		const uid = randomUUID()
		// Set session
		await setSession(
			uid,
			JSON.stringify({
				createdAt: new Date(),
				uid,
			} as Session),
			event,
		)
	}
})
