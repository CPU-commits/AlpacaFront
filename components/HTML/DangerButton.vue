<script setup lang="ts">
// Types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum TypeButton {
	'button',
	'submit',
}

defineProps<{
	type: keyof typeof TypeButton
	disabled?: boolean
	click?: () => any
}>()
</script>

<template>
	<button :disabled="disabled" :type="type" @click="click">
		<slot />
	</button>
</template>

<style lang="scss" scoped>
button {
	width: 100%;
	padding: 6px;
	transition: all 0.3s ease;
	border-radius: 40px;
	border: none;
	border: 2px solid var(--color-danger);
	font-size: 0.9rem;
	color: var(--color-danger);
}

button:hover {
	background-color: #fff;
	color: var(--color-text-contrast-with-second);
}
</style>
