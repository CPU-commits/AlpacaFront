import type { Design } from '../design/design.model'
import type { Image } from '../file/image.model'
import type { Studio } from '../studio/studio.model'
import type { Profile } from '../user/profile.model'
import type { User } from '../user/user.model'
import type { Review } from './review.model'

export type Appointment = {
	id: number
	phone?: string
	status: string
	idTattooArtist?: number
	idUser: number
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
	design?: Design
	images?: Array<Image>
	review?: Review
	studio?: Studio
}
