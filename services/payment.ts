import type { Payment } from '~/models/payments/payment.model'
import { Service } from './service'
import type { BodyHeaders } from '~/models/body.model'

export class PaymentService extends Service {
	async getPayments(params?: { idSubscription?: number; page?: number }) {
		return await this.fetch<BodyHeaders<Array<Payment>>>({
			method: 'get',
			URL: '/api/payments',
			returnHeaders: true,
			params,
		}).then(({ body, headers }) => ({
			payments: body,
			total: parseInt(headers.get('X-Total') ?? '0'),
			perPage: parseInt(headers.get('X-Per-Page') ?? '0'),
		}))
	}
}
