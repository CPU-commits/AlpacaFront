<script lang="ts" setup>
// Types
import type { Tattoo } from '@/models/tattoo/tattoo.model'
// Router
const route = useRoute()

const idStudio = parseInt(route.params.idStudio as string)
// Data
const tattoos = ref<Array<Tattoo> | null>(null)
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
		<Gallery ref="element" :tattoos="tattoos ?? []" />
	</NuxtLayout>
</template>
