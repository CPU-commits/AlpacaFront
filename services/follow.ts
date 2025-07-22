import { Service } from './service'

export class FollowService extends Service {
	async getMyFollow(params: { idStudio?: number; username?: string }) {
		return await this.fetch<{ follow: boolean }>({
			method: 'get',
			URL: '/api/follows/my',
			params,
		}).then(({ follow }) => follow)
	}

	async toggleFollow(
		toFollow: { idStudio?: number; username?: string },
		follow: boolean,
	) {
		try {
			await this.fetch({
				method: 'post',
				URL: `/api/follows${!follow ? '/unfollow' : ''}`,
				body: {
					...toFollow,
				},
			})
			return true
		} catch (err) {
			this.addErrorToast(err)

			return false
		}
	}
}
