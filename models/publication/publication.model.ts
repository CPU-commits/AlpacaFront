import type { Image } from '../file/image.model'
import type { Tattoo } from '../tattoo/tattoo.model'
import type { Profile } from '../user/profile.model'

export type Publication = {
	id: number
	content: string
	likes: number
	images?: Array<Image>
	tattoos?: Array<Tattoo>
	categories?: Array<string>
	profile: Profile
	createdAt: string
}
// No se donde ponerlo XDE
export type IsLiked = {
	isLiked: boolean
}
