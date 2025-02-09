<script lang="ts" setup>
import type { Category } from '~/models/tattoo/category.model'

defineProps<{
	categories: Array<Category>
}>()
</script>

<template>
	<div class="Categories">
		<span v-for="category in categories" :key="category.id">
			#{{ category.name }}
		</span>
	</div>
</template>

<style scoped>
.Categories {
	display: flex;
	gap: 5px;
	flex-wrap: wrap;
}

span {
	font-size: 0.9rem;
	background-color: var(--color-second);
	padding: 0 5px;
	border-radius: 8px;
	color: var(--color-text-with-second);
	box-shadow: var(--box-shadow);
}
</style>
