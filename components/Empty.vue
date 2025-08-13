<script lang="ts" setup>
const { text, marginTop = true } = defineProps<{
	text: string
	marginTop?: boolean
}>()
</script>

<template>
	<div class="Empty" :class="{ MarginTop: marginTop }">
		<img src="@/assets/illustrations/empty.webp" alt="Empty" />
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
}

.MarginTop {
	margin-top: 100px;
}

img {
	max-width: 500px;
	width: 100%;
	border: 1px solid var(--color-light);
}
</style>
