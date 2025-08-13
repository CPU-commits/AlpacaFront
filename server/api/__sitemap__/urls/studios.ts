import { getSitemapData } from '~/server/utils/sitemap'

export default defineSitemapEventHandler(async () => {
	const sitemap = await getSitemapData<{ id: number }>('studios')

	return sitemap.map(({ data, ...rest }) => ({
		_sitemap: 'studios',
		loc: `/s/${data?.id}`,
		_i18nTransform: true,
		...rest,
	}))
})
