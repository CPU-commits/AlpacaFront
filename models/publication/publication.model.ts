import type { Image } from '../file/image.model'
import type { Category } from '../tattoo/category.model'
import type { Tattoo } from '../tattoo/tattoo.model'
import type { Profile } from '../user/profile.model'

export type Publication = {
	id: number
	content: string
	likes: number
	images?: Array<Image>
	tattoos?: Array<Tattoo>
	categories?: Array<Category>
	profile: Profile
	createdAt: string
}
