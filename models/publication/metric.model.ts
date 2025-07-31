export type PubMetric = {
	count: number
	stats: Array<{
		day: string
		count: number
	}>
}

export type PubMetrics = {
	views: PubMetric
	shares: PubMetric
	likes: PubMetric
}
