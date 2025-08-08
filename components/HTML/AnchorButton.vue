<script lang="ts" setup>
defineProps<{
	to: string
	primary?: boolean
	target?: string
	rel?: string
}>()
</script>

<template>
	<NuxtLink
		class="Anchor"
		:class="{ Primary: primary }"
		:to="to"
		:target="target"
		:rel="rel"
	>
		<slot />
	</NuxtLink>
</template>

<style>
.Anchor i {
	color: var(--color-main);
}
</style>

<style scoped lang="scss">
.Anchor {
	padding: 8px;
	background-color: transparent;
	text-decoration: none;
	display: flex;
	gap: 5px;
	color: var(--color-main);
	align-items: center;
	font-size: 0.9rem;
	justify-content: center;
	border: 2px solid transparent;
	border-radius: 20px;
	i {
		color: var(--color-main);
	}
}

.Primary:hover {
	color: var(--color-text-contrast-with-second);
	background-color: var(--color-contrast-second);
	border: 2px solid var(--color-second);
}

.Primary {
	color: var(--color-text-with-second);
	background-color: var(--color-second);
}
</style>
