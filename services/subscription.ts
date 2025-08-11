import type { Subscription } from '~/models/payments/subscription.model'
import { Service } from './service'
import type { Plan } from '~/models/payments/plan.model'
import { BlockConcurrentError } from '~/common/fetchModule'

export class SubscriptionService extends Service {
	async getMySubscription(params?: { idStudio?: number }) {
		return await this.fetch<Subscription | null>({
			method: 'get',
			URL: '/api/subscriptions/my',
			params,
		})
	}

	async getPlans(params?: { forStudios?: boolean; all?: boolean }) {
		return await this.fetch<Array<Plan>>({
			method: 'get',
			URL: '/api/subscriptions/plans',
			params,
		})
	}

	async requestSubscription(idPlan: number, params?: { idStudio?: number }) {
		return await this.fetch<{ link: string }>({
			method: 'post',
			URL: `/api/subscriptions/plans/${idPlan}/request`,
			params,
		})
			.then(({ link }) => link)
			.catch((err) => this.addErrorToast(err))
	}

	async cancelSubscription() {
		try {
			await this.fetch({
				method: 'delete',
				URL: '/api/subscriptions/cancel',
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
