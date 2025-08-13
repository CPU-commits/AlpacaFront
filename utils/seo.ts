import {
	//FULL_LOGO_HEIGHT,
	FULL_LOGO_IMAGE_URL,
	//FULL_LOGO_WIDTH,
	SITE_URL,
} from '~/common/configs'

export function seoMetaNoIndex(title?: string) {
	return {
		title: title ?? 'Alpaca Tattoo',
		robots: 'none',
	}
}

export function buildSeoMeta(seo: {
	title: string
	description: string
	ogType: 'website' | 'article' | 'profile'
	ogImage?: {
		key?: string
		url?: string
	}
	ogImageType?: 'image/jpeg'
	ogImageAlt?: string
	ogUrlPath?: string
	setTitle?: boolean
	profile?: {
		firstName: string
		username: string
	}
	article?: {
		publishedAt: string
		author: Array<string>
		updatedAt: string
		tags: Array<string>
	}
}) {
	const { t } = useI18n()

	const title = `${seo.title}${seo.setTitle ? '' : ' - Alpaca Tattoo'}`
	let ogImage: string = FULL_LOGO_IMAGE_URL
	const ogImageAlt = seo.ogImageAlt ?? t('common.altFullLogo')

	if (seo.ogImage?.url) ogImage = seo.ogImage.url
	else if (seo.ogImage?.key)
		ogImage = useImage()(
			seo.ogImage?.key,
			{ width: 300, height: 300, fit: 'cover', quality: 80 },
			{ provider: 'cloudinary' },
		)

	return {
		title,
		description: seo.description,
		ogTitle: title,
		ogType: seo.ogType,
		ogImage,
		ogImageType: seo.ogImageType,
		ogUrl: `${SITE_URL}${seo.ogUrlPath}`,
		ogDescription: seo.description,
		ogSiteName: 'Alpaca Tattoo',
		ogImageAlt,
		profileFirstName: seo.profile?.firstName,
		profileUsername: seo.profile?.username,
		articlePublishedTime: seo.article?.publishedAt,
		articleAuthor: seo.article?.author,
		articleModifiedTime: seo.article?.updatedAt,
		articleTag: seo.article?.tags,
		//ogImageWidth: FULL_LOGO_WIDTH,
		//ogImageHeight: FULL_LOGO_HEIGHT,
	}
}
