<script lang="ts" setup>
import type { Tattoo } from '~/models/tattoo/tattoo.model'

defineProps<{
	tattoos: Array<Tattoo>
}>()
</script>

<template>
	<section class="GalleryColumn">
		<article v-for="tattoo in tattoos" :key="tattoo.id">
			<Tattoo :tattoo="tattoo" />
		</article>
	</section>
</template>

<style>
.GalleryColumn {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 15px;
}
</style>
