<script lang="ts" setup>
defineProps<{
	categories: Array<string>
}>()
</script>

<template>
	<div class="Categories">
		<span v-for="category in categories" :key="category">
			#{{ category }}
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
