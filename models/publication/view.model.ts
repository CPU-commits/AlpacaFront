export const TTL_MS = 1000 * 60 * 60 * 3

export interface View {
	id: string
	ttl: number
	timestamp: number
}

export type Views = {
	views: number[]
}
