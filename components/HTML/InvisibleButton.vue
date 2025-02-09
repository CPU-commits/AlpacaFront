<script lang="ts" setup>
defineProps<{
	click: () => any
	disabled?: boolean
}>()
</script>

<template>
	<button
		class="InvisibleButton"
		type="button"
		:disabled="disabled"
		@click="click"
	>
		<slot />
	</button>
</template>

<style>
.InvisibleButton {
	border: none;
	background-color: transparent;
}
</style>
