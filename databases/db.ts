import Dexie, { type EntityTable } from 'dexie'
import type { Share } from '~/models/publication/share.model'
import type { View } from '~/models/publication/view.model'

const db = new Dexie('views') as Dexie & {
	views: EntityTable<View, 'id'>
	shares: EntityTable<Share, 'id'>
}

db.version(1).stores({
	views: 'id, ttl, timestamp',
	shares: 'id, timestamp',
})

export { db }
