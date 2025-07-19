<script lang="ts" setup>
import type { Tattoo } from '~/models/tattoo/tattoo.model'

const { tattoos } = defineProps<{
	tattoos: Array<Tattoo>
}>()

const updateWidth = () => {
	windowWidth.value = window.innerWidth
}

onMounted(() => {
	windowWidth.value = window.innerWidth
	window.addEventListener('resize', updateWidth)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateWidth)
})

const windowWidth = ref<number | null>(null)
// /2
const pairTattoos = computed(() => tattoos?.filter((_, i) => i % 2 === 0))
const impairTattoos = computed(() => tattoos?.filter((_, i) => i % 2 !== 0))
// /4
const first4Tattoos = computed(() => tattoos?.filter((_, i) => i % 3 === 0))
const second4Tattoos = computed(() => tattoos?.filter((_, i) => i % 3 === 1))
const third4Tattoos = computed(() => tattoos?.filter((_, i) => i % 3 === 2))
</script>

<template>
	<section class="Gallery">
		<template v-if="tattoos && tattoos.length > 0">
			<template v-if="windowWidth && windowWidth <= 550">
				<GalleryColumn v-if="tattoos" :tattoos="tattoos" />
			</template>
			<template v-else-if="windowWidth && windowWidth <= 950">
				<GalleryColumn v-if="pairTattoos" :tattoos="pairTattoos" />
				<GalleryColumn v-if="impairTattoos" :tattoos="impairTattoos" />
			</template>
			<template v-else-if="windowWidth && windowWidth > 950">
				<GalleryColumn v-if="first4Tattoos" :tattoos="first4Tattoos" />
				<GalleryColumn
					v-if="second4Tattoos"
					:tattoos="second4Tattoos"
				/>
				<GalleryColumn v-if="third4Tattoos" :tattoos="third4Tattoos" />
			</template>
		</template>

		<div class="Empty">
			<Empty
				v-if="tattoos && tattoos.length === 0"
				:text="$t('gallery.noTattoos')"
			/>
		</div>
	</section>
</template>

<style scoped>
.Gallery {
	display: flex;
	width: 100%;
	gap: 15px;
	padding: 10px;
}

.Empty {
	width: 100%;
	justify-content: center;
}
</style>
