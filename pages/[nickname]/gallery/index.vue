<script lang="ts" setup>
// Types
import type { Tattoo } from '@/models/tattoo/tattoo.model'
// Router
const route = useRoute()

const nickname = route.params.nickname as string
// Data
const tattoos = ref<Array<Tattoo> | null>(null)
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

onMounted(() => {
	getTattoos(0, true)
})

onBeforeUnmount(() => {
	if (element) removeOnScroll(element)
})
</script>

<template>
	<Gallery ref="element" :tattoos="tattoos ?? []" />
</template>
