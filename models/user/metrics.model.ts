export type ProfileMetrics = {
	views: {
		byLocation: {
			locations: Array<{ location: string; value: number }>
			count: number
		}
		byTime: {
			stats: Array<{ day: string; views: number }>
			count: number
		}
		byTimeComparative: {
			stats: Array<{ day: string; views: number }>
			count: number
		}
	}
	follows: {
		byTime: {
			stats: Array<{ follows: number; day: string }>
			count: number
		}
		byTimeComparative: {
			stats: Array<{ follows: number; day: string }>
			count: number
		}
	}
}
