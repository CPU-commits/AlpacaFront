import type { Image } from '../file/image.model'
import type { Profile } from '../user/profile.model'
import type { User } from '../user/user.model'

export type Appointment = {
	id: number
	phone?: string
	status: string
	area?: string
	hasIdea: boolean
	height?: number
	tattooArtistProfile?: Profile
	userProfile?: Profile
	width?: number
	color?: string
	description: string
	createdAt: string
	user?: User
	scheduledAt?: string
	finishedAt?: string
	tattooArtist?: User
	images?: Array<Image>
}
