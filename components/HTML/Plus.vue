<script lang="ts" setup>
import { PhPlus } from '@phosphor-icons/vue'

defineProps<{
	toPlus: string
}>()
</script>

<template>
	<aside>
		<HTMLSimpleAnchor class="Plus" :to="toPlus">
			<PhPlus height="30" color="var(--color-text-with-main)" />
		</HTMLSimpleAnchor>
	</aside>
</template>

<style scoped>
aside {
	position: fixed;
	bottom: 60px;
	right: 20px;
	background-color: var(--color-main);
	border-radius: 20px;
	width: 40px;
	height: 40px;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
