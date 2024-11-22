import dayjs from 'dayjs'
import type { H3Event } from 'h3'
import { storage } from './storage'
import { COOKIE_SESSION } from '@/common/cookies'

export async function setSession(
	idSession: string,
	session: string,
	event: H3Event,
) {
	// Redis set session
	const {
		cookies: { EXPIRY_IN_SECONDS },
	} = useRuntimeConfig()
	await storage.setItem(idSession, session, {
		ttl: EXPIRY_IN_SECONDS + 60,
	})

	// Set cookie
	const url = new URL(
		event.node.req.url ?? '',
		`http://${event.node.req.headers.host}`,
	)
	setCookie(event, COOKIE_SESSION, encrypt(idSession), {
		domain: url.hostname,
		expires: dayjs().add(EXPIRY_IN_SECONDS, 'seconds').toDate(),
		httpOnly: true,
		path: '/',
		sameSite: 'strict',
		secure: !import.meta.dev,
	})

	return {
		success: true,
	}
}
