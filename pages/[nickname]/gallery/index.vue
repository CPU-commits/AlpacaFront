<script lang="ts" setup>
// Types
import type { Tattoo } from '@/models/tattoo/tattoo.model'
// Router
const route = useRoute()

const nickname = route.params.nickname as string
// Data
const tattoos = ref<Array<Tattoo> | null>(null)

const windowWidth = ref<number | null>(null)
// /2
const pairTattoos = computed(() => tattoos.value?.filter((_, i) => i % 2 === 0))
const impairTattoos = computed(() =>
	tattoos.value?.filter((_, i) => i % 2 !== 0),
)
// /4
const first4Tattoos = computed(() =>
	tattoos.value?.filter((_, i) => i % 4 === 0),
)
const second4Tattoos = computed(() =>
	tattoos.value?.filter((_, i) => i % 4 === 1),
)
const third4Tattoos = computed(() =>
	tattoos.value?.filter((_, i) => i % 4 === 2),
)
const fourth4Tattoos = computed(() =>
	tattoos.value?.filter((_, i) => i % 4 === 3),
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

const updateWidth = () => {
	windowWidth.value = window.innerWidth
}

onMounted(() => {
	windowWidth.value = window.innerWidth
	window.addEventListener('resize', updateWidth)

	getTattoos(0, true)
})

onBeforeUnmount(() => {
	if (element) removeOnScroll(element)
	window.removeEventListener('resize', updateWidth)
})
</script>

<template>
	<section class="Gallery">
		<template v-if="windowWidth && windowWidth <= 550">
			<GalleryColumn v-if="tattoos" :tattoos="tattoos" />
		</template>
		<template v-else-if="windowWidth && windowWidth <= 950">
			<GalleryColumn v-if="pairTattoos" :tattoos="pairTattoos" />
			<GalleryColumn v-if="impairTattoos" :tattoos="impairTattoos" />
		</template>
		<template v-else-if="windowWidth && windowWidth > 950">
			<GalleryColumn v-if="first4Tattoos" :tattoos="first4Tattoos" />
			<GalleryColumn v-if="second4Tattoos" :tattoos="second4Tattoos" />
			<GalleryColumn v-if="third4Tattoos" :tattoos="third4Tattoos" />
			<GalleryColumn v-if="fourth4Tattoos" :tattoos="fourth4Tattoos" />
		</template>
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
