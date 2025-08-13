<script lang="ts" setup>
import { SITE_URL } from '~/common/configs'

// Route
const idStudio = parseInt(useRoute().params.idStudio as string)

if (!useAuthStore().isAuth) {
	useRouter().push(`/register?to-calendar=${idStudio}&studio=true`)
}
// Data
const { data, error } = await useAsyncData(async (app) => {
	return await Promise.all([
		app?.$studioService.getStudio(idStudio),
		app?.$studioService.getStudioTattooArtists(idStudio),
	])
})
const studio = ref(data.value?.[0])
const tattooArtists = ref(data.value?.[1])
// SEO
const { t } = useI18n()

const seoMeta = buildSeoMeta({
	title: t('calendar.addWithStudio', { nickname: studio.value?.name }),
	description: t('calendar.addWithStudio', { nickname: studio.value?.name }),
	ogType: 'website',
	ogImage: {
		key: studio.value?.avatar?.key,
	},
	ogUrlPath: `/s/${idStudio}/calendar/new`,
	ogImageAlt: studio.value?.avatar?.key
		? t('profile.metadata.logo', { name: studio.value?.name })
		: t('common.altFullLogo'),
})
useSeoMeta(seoMeta)

useJsonld({
	'@context': 'https://schema.org',
	'@type': 'Service',
	'@id': seoMeta.ogUrl,
	name: t('calendar.addWithStudio', { nickname: studio.value?.name }),
	serviceType: t('calendar.service'),
	areaServed: studio.value?.fullAddress,
	provider: {
		'@type': 'Organization',
		'@id': seoMeta.ogUrl,
		name: studio.value?.name,
		url: `${SITE_URL}/s/${idStudio}`,
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
			name: `${studio.value?.name} - Alpaca Tattoo`,
			item: `${SITE_URL}/s/${idStudio}`,
		},
		{
			'@type': 'ListItem',
			position: 2,
			name: seoMeta.title,
			item: seoMeta.ogUrl,
		},
	],
})
</script>

<template>
	<ErrorWrapper :errors="[error]" throw-err>
		<AppointmentNew
			:username="studio?.username ?? ''"
			:avatar="studio?.avatar?.key"
			:id-studio="idStudio"
			:tattoo-artists="tattooArtists"
		/>
	</ErrorWrapper>
</template>
