import type { Plan } from './plan.model'

export type Subscription = {
	id: number
	plan: Plan
	billingAnchor: number
	createdAt: string
	endDate: string
	status: 'trialing' | 'active' | 'paused' | 'past_due' | 'canceled'
	cardLastFour?: string
	cardBrand?: string
	cancelledAt?: string
	updateMethodUrl?: string
	nextBillingDate: string
}
