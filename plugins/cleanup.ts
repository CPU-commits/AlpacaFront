import { db } from '~/databases/db'
import { TTL_MS } from '~/models/publication/view.model'

async function cleanupViews() {
	const allViews = await db.views.toArray()
	const now = Date.now()

	for (const view of allViews) {
		if (now - view.timestamp > TTL_MS) {
			await db.views.delete(view.id)
		}
	}
}

export default defineNuxtPlugin({
	setup() {
		if (import.meta.server) return
		cleanupViews()

		setInterval(cleanupViews, 1000 * 60 * 60)
	},
})
