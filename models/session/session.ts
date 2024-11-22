export interface Session<T = undefined> {
	uid: string
	createdAt: Date
	data: T
}
