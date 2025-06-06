<script lang="ts" setup>
defineProps<{
	text: string
}>()
</script>

<template>
	<div class="Danger">
		<p><i class="fa-solid fa-triangle-exclamation"></i> {{ text }}</p>
	</div>
</template>

<style scoped>
.Danger p {
	font-weight: bold;
}
</style>
