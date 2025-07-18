<script setup lang="ts">
const { validators, id, value } = withDefaults(
	defineProps<{
		value: string
		id?: string
		type?: string
		placeholder?: string
		keyup?: () => any
		checked?: boolean
		disabled?: boolean
		label?: string
		color?: string
		validators?: {
			required?: boolean
			maxLength?: number
			stage?: number
			url?: boolean
			email?: boolean
			namespace?: string
		} | null
	}>(),
	{
		id: '',
		type: 'text',
		placeholder: '',
		disabled: false,
		label: '',
		color: '',
		keyup: () => {},
		validators: null,
	},
)

defineEmits<{
	(e: 'update:value', value: any): void
	(e: 'update:checked', checked: boolean): void
}>()

// Ref
const input = ref<HTMLInputElement | null>(null)
// Composables
const formErrors = useFormErrors()
const forceErrors = useForceErrors()

onMounted(() => {
	if (validators && !formErrors.value.has(id)) {
		const hasErrors = validate(value, id, validators, true)

		formErrors.value.set(id, {
			hasErrors: hasErrors ?? true,
			errors: [],
			stage: validators.stage,
			namespace: validators.namespace,
		})
	}
})

onUnmounted(() => {
	if (validators?.stage === undefined) formErrors.value.delete(id)
})

watch(forceErrors, (forceErrors) => {
	if (
		!forceErrors?.namespace ||
		forceErrors.namespace === validators?.namespace
	)
		validate(input.value?.value ?? '', id, validators)
})
</script>

<template>
	<div class="Input">
		<label v-if="label && label !== ''" :for="id">
			{{ label }}
		</label>
		<textarea
			:id="id"
			ref="input"
			:class="type === 'color' ? 'Color' : ''"
			:value="value"
			:type="type"
			:checked="checked"
			:placeholder="placeholder"
			:disabled="disabled"
			:style="{ color }"
			@keyup="keyup ?? null"
			@input="
				(e: Event) => {
					$emit('update:value', (e.target as HTMLInputElement).value)
					validate(
						(e.target as HTMLInputElement).value,
						id,
						validators,
					)
				}
			"
			@change="
				$emit(
					'update:checked',
					($event.target as HTMLInputElement).checked,
				)
			"
			@focusout="
				(e: Event) =>
					validate(
						(e.target as HTMLInputElement).value,
						id,
						validators,
					)
			"
		/>
		<HTMLErrorMessage :id="id" />
	</div>
</template>

<style lang="scss" scoped>
.Input {
	display: flex;
	flex-direction: column;
	gap: 8px;
	width: 100%;
}

textarea {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	background-color: transparent;
	border: none;
	border: 1px var(--color-light) solid;
	transition: all 0.4s ease-in-out;
	border-radius: 8px;
	resize: none;
	min-height: 80px;
}

textarea:focus {
	outline: none;
	border: 1px var(--color-second) solid;
}

// Media queries
@media (max-width: 767.98px) {
	textarea {
		padding: 8px;
		font-size: 0.8rem;
	}
	label {
		font-size: 0.9rem;
	}
}

@media (max-width: 575.98px) {
	textarea {
		padding: 7px;
		font-size: 0.75rem;
		border-bottom: 1px var(--color-light) solid;
	}

	textarea:focus {
		border-bottom: 1.5px var(--color-main) solid;
		outline: none;
	}
}
</style>
