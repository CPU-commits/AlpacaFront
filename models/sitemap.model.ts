import type { Changefreq } from '@nuxtjs/sitemap'

export type SitemapData<T> = {
	changefreq: Changefreq
	images?: Array<{ loc: string }>
	lastmod: string
	priority:
		| 0
		| 1
		| 0.1
		| 0.2
		| 0.3
		| 0.4
		| 0.5
		| 0.6
		| 0.7
		| 0.8
		| 0.9
		| undefined
	data?: T
}
