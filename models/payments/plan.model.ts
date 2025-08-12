export type PlanFeature = {
	label: string
	value: any
}

export type Plan = {
	id: number
	description?: string
	name: string
	features: Array<PlanFeature>
	price: number
	bannerUrl?: string
	currency: string
	forStudios: boolean
	trialDays: number
	createdAt: string
	billingCycle: string
	updatedAt: string
	volumeItem?: string
	pricingModel: 'standard' | 'volume'
}
