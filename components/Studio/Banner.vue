<script lang="ts" setup>
const { priority = 'banner' } = defineProps<{
	banner?: string
	src?: string
	priority?: 'banner' | 'src'
}>()
</script>

<template>
	<NuxtImg
		v-if="(banner && priority === 'banner') || (!src && banner)"
		:src="banner"
		provider="cloudinary"
	/>
	<img
		v-else-if="(src && priority === 'src') || (!banner && src)"
		:src="src"
		alt="Banner Source"
	/>
	<img v-else src="@/assets/skeleton/banner.webp" alt="Banner" />
</template>

<style scoped>
img {
	width: 100%;
	max-height: 250px;
	object-fit: cover;
}
</style>
