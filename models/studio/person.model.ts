import type { User } from '../user/user.model'
import type { StudioPermission } from './permission.model'

export type StudioRole = 'owner' | 'admin' | 'tattoo_artist'

export type StudioPerson = {
	idUser: number
	idStudio: number
	permissions?: Array<StudioPermission>
	roles: Array<StudioRole>
	user: User
}
