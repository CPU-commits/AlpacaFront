import type { Image } from '../file/image.model'
import type { Profile } from '../user/profile.model'
import type { Category } from './category.model'

export type Tattoo = {
	id: number
	likes: number
	image: Image
	categories?: Array<Category>
	createdAt: string
	views: number
	profile: Profile
	description?: string
}
