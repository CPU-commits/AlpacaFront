<script lang="ts" setup>
import { SITE_URL } from '~/common/configs'

// Route
const nickname = useRoute().params.nickname as string

if (!useAuthStore().isAuth) {
	useRouter().push(`/register?to-calendar=${nickname}`)
}
// Data
const { data, error } = await useAsyncData(async (app) => {
	return await Promise.all([app?.$profileService.getProfile(nickname)])
})
const profile = ref(data.value?.[0])

// SEO
const { t } = useI18n()

const seoMeta = buildSeoMeta({
	title: t('calendar.addWith', { nickname }),
	description: t('calendar.addWith', { nickname }),
	ogType: 'website',
	ogImage: {
		key: profile.value?.avatar?.key,
	},
	ogUrlPath: `/${nickname}/calendar/new`,
	ogImageAlt: profile.value?.avatar?.key
		? t('profile.metadata.logo', { name: nickname })
		: t('common.altFullLogo'),
})
useSeoMeta(seoMeta)

useJsonld({
	'@context': 'https://schema.org',
	'@type': 'Service',
	'@id': seoMeta.ogUrl,
	name: t('calendar.addWith', { nickname }),
	serviceType: t('calendar.service'),
	areaServed: profile.value?.user?.location,
	provider: {
		'@type': 'Person',
		'@id': `${SITE_URL}/${nickname}#id${profile.value?.id}`,
		name: profile.value?.user?.name,
		url: `${SITE_URL}/${nickname}`,
	},
	broker: {
		'@type': 'Organization',
		'@id': SITE_URL,
		name: 'Alpaca Tattoo',
	},
	availableChannel: {
		'@type': 'ServiceChannel',
		serviceUrl: seoMeta.ogUrl,
	},
	potentialAction: {
		'@type': 'AskAction',
		target: {
			'@type': 'EntryPoint',
			urlTemplate: seoMeta.ogUrl,
			actionPlatform: [
				'http://schema.org/DesktopWebPlatform',
				'http://schema.org/MobileWebPlatform',
			],
		},
	},
})

useJsonld({
	'@context': 'https://schema.org',
	'@type': 'BreadcrumbList',
	itemListElement: [
		{
			'@type': 'ListItem',
			position: 1,
			name: `${nickname} - Alpaca Tattoo`,
			item: `${SITE_URL}/${nickname}`,
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: `${t('calendar.addWith', { nickname })} - Alpaca Tattoo`,
			item: `${SITE_URL}/${nickname}/calendar/new`,
		},
	],
})
</script>

<template>
	<ErrorWrapper :errors="[error]" throw-err>
		<AppointmentNew
			:avatar="profile?.avatar?.key"
			:username="profile?.user.username ?? ''"
			:id-tattoo-artist="profile?.user.id"
		/>
	</ErrorWrapper>
</template>
