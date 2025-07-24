import type { Image } from '../file/image.model'
import type { Profile } from '../user/profile.model'

export type Design = {
	id: number
	profile: Profile
	image: Image
	description?: string
	categories?: Array<string>
	price?: number
	createdAt: string
}
