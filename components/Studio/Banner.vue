<script lang="ts" setup>
defineProps<{
	banner?: string
}>()
</script>

<template>
	<NuxtImg v-if="banner" :src="banner" provider="cloudinary" />
	<img v-else src="@/assets/skeleton/banner.webp" alt="Banner" />
</template>

<style scoped>
img {
	width: 100%;
	max-height: 250px;
	object-fit: cover;
}
</style>
