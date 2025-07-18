<script setup lang="ts">
const props = defineProps<{
	value: string
	id: string
	disabled?: boolean
	change?: (...a: any) => any
	dataId?: string
	label?: string
	options: Array<{
		text: string
		value: string
		icon: string
	}>
	validators?: {
		required?: boolean
		stage?: number
		namespace?: string
	}
}>()

const emits = defineEmits<{
	(e: 'update:value', value: string): void
	(
		e: 'update:valueWithOldValue',
		v: { value: string; oldValue: string },
	): void
}>()

watch(
	() => props.value,
	(value, oldValue) => {
		emits('update:valueWithOldValue', {
			value,
			oldValue,
		})
	},
)
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
			namespace: props.validators.namespace,
		})
	}
})

onBeforeUnmount(() => {
	if (props.validators?.stage === undefined) formErrors.value.delete(props.id)
})

watch(forceErrors, (forceErrors) => {
	if (
		!forceErrors?.namespace ||
		forceErrors.namespace === props.validators?.namespace
	)
		validate(props.value ?? '', props.id, props.validators)
})
</script>

<template>
	<div class="Select">
		<label v-if="label && label !== ''" :for="id">
			{{ label }}
		</label>
		<div class="Selected">
			<i
				v-if="value"
				:class="options.find(({ value: val }) => val === value)?.icon"
			/>
			<select
				:id="id"
				:data-id="dataId"
				:value="value"
				:disabled="disabled"
				@change="onChange"
				@focusout="
					(e: Event) =>
						validate(
							(e.target as HTMLInputElement).value,
							id,
							validators,
						)
				"
			>
				<div v-for="(option, i) in options" :key="i">
					<option :value="option.value">{{ option.text }}</option>
				</div>
			</select>
		</div>

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
	box-sizing: border-box;
	background-color: transparent;
	border: none;
}

.Selected:hover {
	border: 1px var(--color-second) solid;
}

select:focus {
	outline: none;
}

//mejorar el gris de un boton disabled
select:disabled {
	background-color: var(--color-light);
}

.Selected {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px;
	border: 1px var(--color-light) solid;
	transition: all 0.4s ease-in-out;
	border-radius: 8px;
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
