import { BlockConcurrentError } from '~/common/fetchModule'
import { Service } from './service'
import type { Publication } from '~/models/publication/publication.model'
import type { BodyHeaders } from '~/models/body.model'

export class PostService extends Service {
	async getPublications(username: string, params?: { page?: number }) {
		return await this.fetch<BodyHeaders<Array<Publication>>>({
			method: 'get',
			URL: `/api/publications/username/${username}`,
			params,
			returnHeaders: true,
		}).then(({ body, headers }) => ({
			publications: body,
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}

	async getMyLike(idPublication: number) {
		return await this.fetch<{ isLike: boolean }>({
			method: 'get',
			URL: `/api/publications/${idPublication}/like`,
		})
	}

	async publish(publication: {
		content: string
		images: Array<{ isTattoo: boolean; image: File }>
	}) {
		try {
			const formData = new FormData()
			formData.set('content', publication.content)
			publication.images.forEach((image, i) => {
				formData.set(`image[${i}]`, image.image)
				formData.append(
					'images',
					JSON.stringify({
						isTattoo: image.isTattoo ?? false,
					}),
				)
			})

			return await this.fetch<Publication>({
				method: 'post',
				URL: '/api/publications',
				body: formData,
				blockConcurrentFetch: true,
			})
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}

	async handleLikePublication(idPublication: number) {
		try {
			await this.fetch({
				method: 'post',
				URL: `/api/publications/${idPublication}/like`,
				blockConcurrentFetch: true,
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}

	async deletePublication(idPublication: number) {
		try {
			await this.fetch({
				method: 'delete',
				URL: `/api/publications/${idPublication}`,
				blockConcurrentFetch: true,
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}
}
