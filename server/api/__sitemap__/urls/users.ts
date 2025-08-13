import { UserTypesKeys } from '~/models/user/user.model'
import { getSitemapData } from '~/server/utils/sitemap'

export default defineSitemapEventHandler(async () => {
	const sitemap = await getSitemapData<{ username: string }>('users', {
		roles: UserTypesKeys.TATTOO_ARTIST,
	})

	return sitemap.map(({ data, ...rest }) => ({
		_sitemap: 'users',
		loc: `/${data?.username}`,
		_i18nTransform: true,
		...rest,
	}))
})
