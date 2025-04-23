<script lang="ts" setup>
defineProps<{
	label?: string
}>()
</script>

<template>
	<div class="Search">
		<HTMLInput
			id="searchValue"
			value=""
			:placeholder="label ?? $t('common.search')"
		/>
	</div>
</template>

<style>
.Search input {
	box-shadow: var(--box-shadow);
	border: 1px solid transparent;
}
</style>

<style scoped>
.Search {
	width: 100%;
}
</style>
