<script setup lang="ts">
const props = defineProps<{
	value: any
	id: string
	disabled?: boolean
	change?: (...a: any) => any
	dataId?: string
	label?: string
	validators?: {
		required?: boolean
		stage?: number
	}
}>()

const emits = defineEmits<{
	(e: 'update:value', value: any): void
}>()

// Composables
const formErrors = useFormErrors()
const forceErrors = useForceErrors()

function onChange(e: Event) {
	const select = e.target as HTMLInputElement
	emits('update:value', select.value)
	validate(select.value, props.id, props.validators)
	if (props.change) props.change()
}

onMounted(() => {
	if (props.validators && !formErrors.value.has(props.id)) {
		const hasErrors = validate(
			props.value,
			props.id,
			props.validators,
			true,
		)

		formErrors.value.set(props.id, {
			hasErrors: hasErrors ?? true,
			errors: [],
			stage: props.validators.stage,
		})
	}
})

onBeforeUnmount(() => {
	if (props.validators?.stage === undefined) formErrors.value.delete(props.id)
})

watch(forceErrors, () => {
	validate(props.value, props.id, props.validators)
})
</script>

<template>
	<div class="Select">
		<label v-if="label && label !== ''" :for="id">
			{{ label }}
		</label>
		<select
			:id="id"
			:data-id="dataId"
			:value="value"
			:disabled="disabled"
			@change="onChange"
			@focusout="
				(e) =>
					validate(
						(e.target as HTMLInputElement).value,
						id,
						validators,
					)
			"
		>
			<slot />
		</select>

		<HTMLErrorMessage :id="id" />
	</div>
</template>

<style lang="scss" scoped>
label {
	padding: 0 4px;
}

.Select {
	display: flex;
	flex-direction: column;
	gap: 8px;
}

select {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	background-color: transparent;
	border: none;
	border: 1px var(--color-light) solid;
	transition: all 0.4s ease-in-out;
	border-radius: 8px;

	option:disabled {
		color: red;
	}

	option {
		color: red;
	}
}

select:focus {
	border: 1px var(--color-second) solid;
	outline: none;
}

//mejorar el gris de un boton disabled
select:disabled {
	background-color: var(--color-light);
}

// Media queries
@media (max-width: 767.98px) {
	select {
		padding: 8px;
		font-size: 0.8rem;
	}
}

@media (max-width: 575.98px) {
	select {
		padding: 7px;
		font-size: 0.75rem;
		border-bottom: 1px var(--color-light) solid;
	}

	select:focus {
		border-bottom: 1.5px var(--color-main) solid;
	}
}
</style>
