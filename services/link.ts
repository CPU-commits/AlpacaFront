import type { MetricLink } from '~/models/link/metric.model'
import { Service } from './service'

export class LinkService extends Service {
	async getLinkMetrics(
		idLink: number,
		params?: {
			to?: string
			from?: string
			toComparative?: string
			fromComparative?: string
			idStudio?: number
		},
	) {
		return await this.fetch<MetricLink>({
			method: 'get',
			URL: `/api/links/${idLink}/metrics`,
			params,
		})
	}
}
