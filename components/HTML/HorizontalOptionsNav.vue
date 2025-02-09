<script lang="ts" setup>
defineProps<{
	items: Array<{
		to: string
		text: string
	}>
}>()
</script>

<template>
	<nav class="HOMenu">
		<HTMLSimpleAnchor
			v-for="(item, i) in items"
			:key="i"
			:to="item.to"
			:class="{ HOMenu__Selected: $route.path === item.to }"
		>
			{{ item.text }}
		</HTMLSimpleAnchor>
	</nav>
</template>

<style scoped>
.HOMenu {
	display: flex;
	justify-content: space-around;
	width: 100%;
}

a {
	text-decoration: none;
	padding: 5px;
}

.HOMenu__Selected {
	border-bottom: 2px solid var(--color-main);
}
</style>
