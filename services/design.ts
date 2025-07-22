import type { BodyHeaders } from '~/models/body.model'
import { Service } from './service'
import type { Design } from '~/models/tattoo/design.model'
import { BlockConcurrentError } from '~/common/fetchModule'

export class DesignService extends Service {
	async getLatestDesigns(username: string) {
		return await this.fetch<Array<Design>>({
			method: 'get',
			URL: `/api/designs/latest/${username}`,
		})
	}
	async getDesigns(username: string, params?: { page: number }) {
		return await this.fetch<BodyHeaders<Array<Design>>>({
			method: 'get',
			URL: `api/designs/${username}`,
			returnHeaders: true,
			params,
		}).then(({ body, headers }) => ({
			designs: body,
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}
	async uploadDesigns(
		designs: Array<{
			image: File
			description: string
			price: string
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

			designs.forEach((design, i) => {
				let priceInt: number = 0
				if (design.price !== '') {
					priceInt = parseInt(design.price, 10)
				}
				formData.append(
					'design',
					JSON.stringify({
						description: design.description || undefined,
						price: priceInt || undefined,
						coordinate,
					}),
				)
				formData.set(`image[${i}]`, design.image)
			})
			return await this.fetch<Array<Design>>({
				method: 'post',
				URL: '/api/designs',
				blockConcurrentFetch: true,
				body: formData,
			})
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}
	async deleteDesign(designId: number) {
		try {
			await this.fetch({
				method: 'delete',
				URL: `/api/designs/${designId}`,
				blockConcurrentFetch: true,
			})
			return true
		} catch (err) {
			if (err instanceof BlockConcurrentError) return null

			this.addErrorToast(err)
			return false
		}
	}
	async updateDesign(
		designId: number,
		design: {
			description?: string
			price?: number
		},
	) {
		try {
			console.log(typeof design.price)
			design.price = Number(design.price)
			await this.fetch({
				method: 'patch',
				URL: `/api/designs/${designId}`,
				body: design,
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
