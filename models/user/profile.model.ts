import type { Image } from '../file/image.model'
import type { User } from './user.model'

export type Profile = {
	id: number
	idUser: number
	description: string
	likes: number
	createdAt: string
	avatar?: Image
	user: User
}
