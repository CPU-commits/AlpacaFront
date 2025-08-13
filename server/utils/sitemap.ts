import type { SitemapData } from '~/models/sitemap.model'

async function getData<T>(path: string, page: number, params?: object) {
	const metadata = {
		total: 0,
		perPage: 1,
	}
	const data = await $fetch<Array<SitemapData<T>>>(
		`/api/${path}/__sitemap__`,
		{
			baseURL: useRuntimeConfig().public.API,
			params: {
				page,
				...params,
			},
			onResponse(res) {
				const headers = res.response.headers
				metadata.total = parseInt(headers.get('X-Total') ?? '0')
				metadata.perPage = parseInt(headers.get('X-Per-Page') ?? '0')
			},
		},
	)

	return {
		metadata,
		data,
	}
}

export async function getSitemapData<T>(path: string, params?: object) {
	let counter = 0
	let page = 0
	let flag = true
	const sitemap = [] as Array<SitemapData<T>>

	while (flag) {
		const data = await getData<T>(path, page, params)
		sitemap.push(...data.data)
		counter += data.data.length
		page += 1

		if (data.metadata.total <= counter) flag = false
	}

	return sitemap
}
