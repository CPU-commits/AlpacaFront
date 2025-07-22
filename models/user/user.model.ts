import type { Media } from '../studio/studio.model'

export enum UserTypes {}

export enum UserTypesKeys {
	TATTOO_ARTIST = 'tattooArtist',
	ADMIN = 'admin',
	USER = 'user',
}

export interface User {
	role: keyof typeof UserTypes
	roles: Array<UserTypesKeys>
	name: string
	id: number
	location?: string
	username: string
	email: string
	phone?: string
	media?: Array<Media>
}
