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
	trialDays: number
	createdAt: string
	updatedAt: string
}
