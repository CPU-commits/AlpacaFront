export type MetricLink = {
	byTime: {
		stats: Array<{ day: string; views: number }>
		count: number
	}
	byTimeComparative: {
		stats: Array<{ day: string; views: number }>
		count: number
	}
}
