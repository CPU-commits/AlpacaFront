import type { Image } from '../file/image.model'
import type { Profile } from '../user/profile.model'

export type Tattoo = {
	id: number
	likes: number
	image: Image
	categories?: Array<string>
	createdAt: string
	views: number
	profile: Profile
	description?: string
	idPublication: number
}
