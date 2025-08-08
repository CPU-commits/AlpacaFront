import type { Image } from '../file/image.model'

export type Media = {
	id: number
	typeMedia: string
	link: string
}

export type Studio = {
	id: number
	name: string
	username: string
	description?: string
	fullAddress: string
	email: string
	isActive: boolean
	phone?: string
	banner?: Image
	avatar?: Image
	media?: Array<Media>
}
