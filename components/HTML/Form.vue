<script lang="ts" setup>
withDefaults(
	defineProps<{ action: () => any; header?: boolean; footer?: boolean }>(),
	{
		header: true,
		footer: true,
	},
)
</script>

<template>
	<form class="Form" @submit.prevent="action">
		<header v-if="header">
			<slot name="title" />
		</header>

		<slot />
		<footer v-if="footer">
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
