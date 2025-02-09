<script lang="ts" setup>
// Types
import type { Tattoo } from '@/models/tattoo/tattoo.model'
// Router
const route = useRoute()

const nickname = route.params.nickname as string
// Data
const tattoos = ref<Array<Tattoo> | null>(null)

const pairTattoos = computed(() => tattoos.value?.filter((_, i) => i % 2 === 0))
const impairTattoos = computed(() =>
	tattoos.value?.filter((_, i) => i % 2 !== 0),
)
// Get gallery
let element: HTMLElement | undefined

async function getTattoos(page = 0, count = false) {
	const dataFetch = await useNuxtApp().$tattooService.getTattoos(nickname, {
		page,
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

onMounted(() => getTattoos(0, true))

onBeforeUnmount(() => {
	if (element) removeOnScroll(element)
})
</script>

<template>
	<section class="Gallery">
		<GalleryColumn v-if="pairTattoos" :tattoos="pairTattoos" />
		<GalleryColumn v-if="impairTattoos" :tattoos="impairTattoos" />
	</section>
</template>

<style>
.Gallery {
	display: flex;
	width: 100%;
	gap: 15px;
	padding: 10px;
}
</style>
