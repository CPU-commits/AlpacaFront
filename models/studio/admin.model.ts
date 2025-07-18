import type { User } from '../user/user.model'
import type { StudioPermission } from './permission.model'

export type StudioAdmin = {
	id: number
	admin: User
	permissions: Array<StudioPermission> | null
	owner: boolean
}
