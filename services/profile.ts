import { BlockConcurrentError } from '~/common/fetchModule'
import { Service } from './service'
import type { Profile } from '~/models/user/profile.model'
import type { Views } from '~/models/publication/view.model'

export class ProfileService extends Service {
	async getProfile(username: string) {
		return await this.fetch<Profile>({
			method: 'get',
			URL: `/api/profiles/${username}`,
		})
	}

	async search(params: { q: string }) {
		return await this.fetch<Array<Profile>>({
			method: 'get',
			URL: `/api/profiles/search`,
			params,
		})
	}

	async getAvatar(idUser: number) {
		return await this.fetch<string>({
			method: 'get',
			URL: `/api/profiles/user/${idUser}/avatar`,
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
		return await this.fetch<Views>({
			method: 'get',
			URL: `/api/profiles/views/${identifier}`,
		}).then(({ views }) => ({
			body: views,
		}))
	}
}
