export enum UserTypes {}

export enum UserTypesKeys {}

export interface User {
	role: keyof typeof UserTypes
}
