import { BlockConcurrentError } from '~/common/fetchModule'
import { Service } from './service'
import type { Profile } from '~/models/user/profile.model'

export class ProfileService extends Service {
	async getProfile(username: string) {
		return await this.fetch<Profile>({
			method: 'get',
			URL: `/api/profiles/${username}`,
		})
	}

	async updateProfile(profile: { description?: string }) {
		try {
			await this.fetch({
				method: 'patch',
				URL: '/api/profiles',
				body: profile,
				blockConcurrentFetch: true,
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}

	async changeAvatar(file: File) {
		try {
			const formData = new FormData()
			formData.set('avatar', file)

			return await this.fetch<{ key: string }>({
				method: 'patch',
				URL: '/api/profiles/avatar',
				blockConcurrentFetch: true,
				body: formData,
			})
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}
	async getUserViews(identifier: string) {
		try {
			return await this.fetch<{ Views: number[] }>({
				method: 'get',
				URL: `/api/profiles/views/${identifier}`,
			}).then(({ Views }) => ({
				views: Views,
			}))
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}
}
