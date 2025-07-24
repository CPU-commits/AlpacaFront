import Dexie, { type EntityTable } from 'dexie'
import type { View } from '~/models/publication/view.model'

const db = new Dexie('views') as Dexie & {
	views: EntityTable<View, 'id'>
}

db.version(1).stores({
	views: 'id, ttl, timestamp',
})

export { db }
