<script lang="ts" setup>
const { text } = defineProps<{
	text: string
}>()
</script>

<template>
	<div class="Empty">
		<img src="@/assets/stickers/empty.svg" alt="Empty" />
		<p>{{ text }}</p>
	</div>
</template>

<style scoped>
.Empty {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	margin-top: 100px;
}

img {
	width: 80px;
	height: 80px;
}
</style>
