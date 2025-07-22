<script lang="ts" setup>
const { marginTop = true } = defineProps<{
	text?: string
	illustration?: 'designs' | 'empty' | 'error' | 'stonks' | 'sub' | 'thanks'
	marginTop?: boolean
}>()
</script>

<template>
	<div class="Illustration" :class="{ MarginTop: marginTop }">
		<img :src="`/illustrations/${illustration}.webp`" alt="Illustration" />
		<p>{{ text }}</p>
	</div>
</template>

<style scoped>
.Illustration {
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
	width: 500px;
	border: 1px solid var(--color-light);
}
</style>
