<script setup lang="ts">
defineProps<{
	to: string
	target?: string
	rel?: string
}>()
</script>

<template>
	<NuxtLink class="SimpleA" :to="to" :target="target" :rel="rel">
		<slot />
	</NuxtLink>
</template>

<style lang="scss">
.SimpleA {
	border: none;
	background-color: transparent;
	transition: all 0.3s ease;
	align-items: flex-end;
	font-size: 1rem;
	i {
		font-size: 1.1rem;
	}
}

.SimpleA:disabled {
	background-color: var(--color-light);
}

.SimpleA:hover {
	color: var(--color-main);
	i,
	span {
		color: var(--color-main);
	}
}
</style>
