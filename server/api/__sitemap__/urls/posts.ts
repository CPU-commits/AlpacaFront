import { getSitemapData } from '~/server/utils/sitemap'

export default defineSitemapEventHandler(async () => {
	const sitemap = await getSitemapData<{ id: number }>('publications')

	return sitemap.map(({ data, ...rest }) => ({
		_sitemap: 'posts',
		loc: `/p/${data?.id}`,
		_i18nTransform: true,
		...rest,
	}))
})
