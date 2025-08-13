<script lang="ts" setup>
// Types
import type { Tattoo } from '@/models/tattoo/tattoo.model'
// Router
const route = useRoute()

const idStudio = parseInt(route.params.idStudio as string)
// Data
const tattoos = ref<Array<Tattoo> | null>(null)
const { data, error } = await useAsyncData(async (app) => {
	return await Promise.all([app?.$studioService.getStudio(idStudio)])
})
const studio = ref(data.value?.[0])
// SEO
const { t } = useI18n()

const seoMeta = buildSeoMeta({
	title: t('gallery.metadata.title', { name: studio.value?.name }),
	description: t('gallery.metadata.description', {
		name: studio.value?.name,
	}),
	ogType: 'website',
	ogImage: {
		key: studio.value?.avatar?.key,
	},
	ogUrlPath: `/s/${idStudio}/gallery`,
	ogImageAlt: studio.value?.avatar?.key
		? t('profile.metadata.logo', { name: studio.value?.name })
		: t('common.altFullLogo'),
})
useSeoMeta(seoMeta)
// Get gallery
let element: HTMLElement | undefined

async function getTattoos(page = 0, count = false) {
	const dataFetch = await useNuxtApp().$tattooService.getTattoos({
		page,
		idStudio,
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
</script>

<template>
	<NuxtLayout name="studio">
		<ErrorWrapper :errors="[error]" throw-err>
			<Gallery ref="element" :tattoos="tattoos" />
		</ErrorWrapper>
	</NuxtLayout>
</template>
