import type { User } from '~/models/user/user.model'
import { Service } from './service'

export class UserService extends Service {
	async search(
		q: string,
		params?: {
			filterUsers?: Array<number>
		},
	) {
		return await this.fetch<Array<User> | null>({
			method: 'get',
			URL: '/api/users/search',
			params: {
				q,
				...params,
			},
			abort: {
				url: 'same',
			},
		}).then((users) => users ?? [])
	}
}
