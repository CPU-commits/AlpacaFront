<script setup lang="ts">
const { value, length, disabled, label } = withDefaults(
	defineProps<{
		value: string
		length?: number
		disabled?: boolean
		label?: string
	}>(),
	{
		value: '',
		length: 6,
		disabled: false,
		label: '',
	},
)

const emit = defineEmits<{
	(e: 'update:value', value: any): void
}>()

const input = ref<HTMLInputElement | null>(null)

const internalValue = ref(value)

const digits = computed(() => {
	return internalValue.value.split('').slice(0, length)
})

watch(
	() => value,
	(val) => {
		if (val !== internalValue.value) {
			internalValue.value = val.slice(0, length)
		}
	},
)

function focusInput() {
	if (!disabled) {
		input.value?.focus()
	}
}

function onKeyDown(e: KeyboardEvent) {
	if (
		internalValue.value.length >= length &&
		e.key !== 'Backspace' &&
		e.key !== 'Delete' &&
		!e.ctrlKey &&
		!e.metaKey
	) {
		e.preventDefault()
	}
}
</script>

<template>
	<div
		class="Otp__input"
		:class="{ disabled }"
		role="group"
		:aria-label="label || ''"
		@click="focusInput"
	>
		<label v-if="label" class="Otp__label">{{ label }}</label>

		<input
			ref="input"
			type="text"
			inputmode="numeric"
			autocomplete="one-time-code"
			:disabled="disabled"
			:value="internalValue"
			:maxlength="length"
			style="
				position: absolute;
				opacity: 0;
				width: 1px;
				height: 1px;
				pointer-events: none;
			"
			@input="
				(e: Event) => {
					const val = (e.target as HTMLInputElement).value
						.replace(/[^a-zA-Z0-9]/g, '')
						.slice(0, length)
					internalValue = val
					emit('update:value', val)
				}
			"
			@keydown="onKeyDown"
		/>

		<div class="Digits" aria-hidden="true">
			<span
				v-for="i in length"
				:key="i"
				class="Digit"
				:class="{ filled: digits[i - 1] !== undefined }"
			>
				{{ digits[i - 1] || '' }}
			</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
.Otp__input {
	position: relative;
	user-select: none;
	cursor: text;
	display: inline-block;

	.Otp__label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.Digits {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}

	.Digit {
		width: 3rem;
		height: 3.5rem;
		border: 1.5px solid var(--color-light);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.8rem;
		background-color: #fff;
		transition:
			border-color 0.3s,
			background-color 0.3s;
		user-select: none;

		&.filled {
			border-color: var(--color-main,);
			font-weight: 700;
		}
	}

	&.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		pointer-events: none;
	}
}
</style>
