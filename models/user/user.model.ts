export enum UserTypes {}

export enum UserTypesKeys {
	TATTOO_ARTIST = 'tattooArtist',
	ADMIN = 'admin',
	USER = 'user',
}

export interface User {
	role: keyof typeof UserTypes
	roles: Array<string>
	name: string
	id: number
	username: string
	email: string
}
