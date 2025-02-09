<script lang="ts" setup>
defineProps<{
	action: () => any
}>()
</script>

<template>
	<form class="Form" @submit.prevent="action">
		<header>
			<slot name="title" />
		</header>

		<slot />
		<footer>
			<slot name="footer" />
		</footer>
	</form>
</template>

<style>
.Form header h1 {
	font-size: 1.1rem;
}
</style>

<style scoped>
.Form {
	display: flex;
	flex-direction: column;
	gap: 10px;
	justify-content: space-between;
}

header {
	border-bottom: 1px solid var(--color-light);
	padding: 3px;
}

footer {
	padding: 10px 0;
}
</style>
