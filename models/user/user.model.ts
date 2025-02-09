export enum UserTypes {}

export enum UserTypesKeys {
	TATTOO_ARTIST = 'tattoArtist',
	ADMIN = 'admin',
	USER = 'user',
}

export interface User {
	role: keyof typeof UserTypes
	name: string
	id: number
	username: string
	email: string
}
