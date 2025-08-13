<script lang="ts" setup>
// Types
import type { Tattoo } from '@/models/tattoo/tattoo.model'
// Router
const route = useRoute()

const nickname = route.params.nickname as string
// Data
const { data, error } = await useAsyncData(async (app) => {
	return await Promise.all([app?.$profileService.getProfile(nickname)])
})
const profile = ref(data.value?.[0])
// Data
const tattoos = ref<Array<Tattoo> | null>(null)
// Get gallery
let element: HTMLElement | undefined

async function getTattoos(page = 0, count = false) {
	const dataFetch = await useNuxtApp().$tattooService.getTattoos({
		page,
		username: nickname,
	})
	if (count) {
		tattoos.value = dataFetch.tattoos
		element = onScroll({
			countReturnedItems: dataFetch.perPage,
			async fx(page) {
				return await getTattoos(page)
			},
			total: dataFetch.total,
		})
	} else {
		tattoos.value?.push(...dataFetch.tattoos)
	}

	return true
}

onMounted(() => {
	getTattoos(0, true)
})

onBeforeUnmount(() => {
	if (element) removeOnScroll(element)
})
// SEO
const { t } = useI18n()

const seoMeta = buildSeoMeta({
	title: t('gallery.metadata.title', { name: nickname }),
	description: t('gallery.metadata.description', { name: nickname }),
	ogType: 'website',
	ogImage: {
		key: profile.value?.avatar?.key,
	},
	ogUrlPath: `/${nickname}/gallery`,
	ogImageAlt: profile.value?.avatar?.key
		? t('profile.metadata.logo', { name: nickname })
		: t('common.altFullLogo'),
})
useSeoMeta(seoMeta)
</script>

<template>
	<ErrorWrapper :errors="[error]" throw-err>
		<Gallery ref="element" :tattoos="tattoos" />
	</ErrorWrapper>
</template>
