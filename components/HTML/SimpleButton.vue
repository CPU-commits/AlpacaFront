<script setup lang="ts">
// Types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
enum TypeButton {
	'button',
	'submit',
}

const { hover = true } = defineProps<{
	type: keyof typeof TypeButton
	disabled?: boolean
	click?: () => any
	hover?: boolean
}>()
</script>

<template>
	<button
		class="SimpleButton"
		:disabled="disabled"
		:class="{ SimpleButtonHover: hover }"
		:type="type"
		@click="click"
	>
		<slot />
	</button>
</template>

<style lang="scss">
.SimpleButton {
	border: none;
	background-color: transparent;
	transition: all 0.3s ease;
	display: flex;
	align-items: flex-end;
	font-size: 1rem;
	i {
		font-size: 1.1rem;
	}
}

.SimpleButton:disabled {
	background-color: var(--color-light);
}

.SimpleButtonHover:hover {
	color: var(--color-main);
	i,
	span {
		color: var(--color-main);
	}
}

// Media queries
@media (max-width: 767.98px) {
	.SimpleButton {
		padding: 6px;
		border-radius: 3px;
		font-size: 0.85rem;
	}
}

@media (max-width: 575.98px) {
	.SimpleButton {
		padding: 5px;
		border-radius: 2px;
		font-size: 0.8rem;
	}
}
</style>
