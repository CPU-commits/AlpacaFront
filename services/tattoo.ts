import type { Category } from '~/models/tattoo/category.model'
import { Service } from './service'
import { BlockConcurrentError } from '~/common/fetchModule'
import type { Tattoo } from '~/models/tattoo/tattoo.model'
import type { BodyHeaders } from '~/models/body.model'

export class TattooService extends Service {
	async getCategories() {
		return await this.fetch<Array<Category>>({
			method: 'get',
			URL: '/api/categories',
		})
	}

	async getKeyTattoo(idTattoo: number) {
		return await this.fetch<{ key: string }>({
			method: 'get',
			URL: `/api/tattoos/urlKey/${idTattoo}`,
		})
	}

	async getLatestTattoos(params: { username?: string; idStudio?: number }) {
		return await this.fetch<Array<Tattoo>>({
			method: 'get',
			URL: `/api/tattoos/latest`,
			params,
		})
	}

	async getTattoos(params?: {
		page: number
		username?: string
		idStudio?: number
	}) {
		return await this.fetch<BodyHeaders<Array<Tattoo>>>({
			method: 'get',
			URL: `/api/tattoos`,
			returnHeaders: true,
			params,
		}).then(({ body, headers }) => ({
			tattoos: body,
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}

	async searchSimilarity(
		params: { page?: number; isLikeidTattoo?: number },
		image?: File | null,
	) {
		const formData = new FormData()
		if (image) formData.set('image', image)

		return await this.fetch<BodyHeaders<Array<Tattoo>>>({
			method: 'post',
			URL: `/api/tattoos/searchByImage`,
			returnHeaders: true,
			body: formData,
			params,
		}).then(({ body, headers }) => ({
			tattoos: body,
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}

	async uploadTattoos(
		tattoos: Array<{
			image: File
			description: string
		}>,
	) {
		try {
			throwIfFormHasError()
			const formData = new FormData()
			let coordinate: { x: number; y: number } | undefined

			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition((position) => {
					coordinate = {
						x: position.coords.latitude,
						y: position.coords.longitude,
					}
				})
			}

			tattoos.forEach((tattoo, i) => {
				formData.append(
					'tattoos',
					JSON.stringify({
						description: tattoo.description || undefined,
						coordinate,
					}),
				)
				formData.set(`image[${i}]`, tattoo.image)
			})

			await this.fetch({
				method: 'post',
				URL: '/api/tattoos',
				blockConcurrentFetch: true,
				body: formData,
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
		}
	}
}
