<script lang="ts" setup>
const { withTag = true } = defineProps<{
	categories: Array<string>
	withTag?: boolean
}>()
</script>

<template>
	<div class="Categories">
		<span v-for="category in categories" :key="category">
			<template v-if="withTag">#</template>{{ category }}
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
