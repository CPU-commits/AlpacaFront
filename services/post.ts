import { BlockConcurrentError } from '~/common/fetchModule'
import { Service } from './service'
import type {
	IsLiked,
	Publication,
} from '~/models/publication/publication.model'
import type { BodyHeaders } from '~/models/body.model'

export class PostService extends Service {
	async getPublications(
		{ username, idStudio }: { username?: string; idStudio?: number },
		params?: { page?: number },
	) {
		return await this.fetch<BodyHeaders<Array<Publication>>>({
			method: 'get',
			URL: username
				? `/api/publications/username/${username}`
				: `/api/publications/studio/${idStudio}`,
			params,
			returnHeaders: true,
		}).then(({ body, headers }) => ({
			publications: body,
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}

	async getPublication(idPublication: number) {
		return await this.fetch<Publication>({
			method: 'get',
			URL: `/api/publications/${idPublication}`,
		})
	}

	async search(params: {
		page?: number
		q: string
		categories?: Array<string> | string
	}) {
		return await this.fetch<BodyHeaders<Array<Publication>>>({
			method: 'get',
			URL: `/api/publications/search`,
			params,
			returnHeaders: true,
		}).then(({ body, headers }) => ({
			publications: body,
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}

	async getMyLike(idPublication: number) {
		return await this.fetch<IsLiked>({
			method: 'get',
			URL: `/api/publications/${idPublication}/like`,
		}).then(({ isLiked }) => ({
			body: isLiked,
		}))
	}

	async publish(publication: {
		content: string
		images: Array<{ isTattoo: boolean; image: File }>
		idStudio?: number
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
			if (publication.idStudio)
				formData.set('idStudio', publication.idStudio.toString())

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
	async addView(
		idPublication: number,
		params?: { identifier: string; identifierType: string },
	) {
		try {
			await this.fetch({
				method: 'post',
				URL: `/api/publications/${idPublication}/view`,
				params: params,
				blockConcurrentFetch: true,
			})
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			// this.addErrorToast(err)
			return false
		}
	}
}
