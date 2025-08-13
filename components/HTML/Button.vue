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
	withoutBackground?: boolean
}>()
</script>

<template>
	<button
		class="HTMLButton"
		:class="{ WithBackground: !withoutBackground }"
		:disabled="disabled"
		:type="type"
		@click="click"
	>
		<slot />
	</button>
</template>

<style lang="scss">
.HTMLButton {
	i {
		font-size: 0.9rem;
	}
}

.HTMLButton.WithBackground {
	i {
		color: var(--color-text-with-second);
	}
}

.HTMLButton:hover {
	i {
		color: var(--color-text-contrast-with-second);
	}
}
</style>

<style lang="scss" scoped>
button {
	width: 100%;
	padding: 6px;
	transition: all 0.3s ease;
	border-radius: 40px;
	border: none;
	border: 2px solid var(--color-second);
	font-size: 0.9rem;
}

.WithBackground {
	color: var(--color-text-with-second);
	background-color: var(--color-second);
}

button:disabled {
	background-color: var(--color-light);
	border: 2px solid var(--color-second);
}

button:hover {
	background-color: #fff;
	color: var(--color-text-contrast-with-second);
}
</style>
