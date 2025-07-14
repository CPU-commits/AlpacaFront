<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		value: string
		id?: string
		type?: string
		placeholder?: string
		keyup?: () => any
		disabled?: boolean
		label?: string
		color?: string
		getElements: (
			input: string,
		) => Promise<Array<{ key: string; value: string }>>
		validators?: {
			required?: boolean
			maxLength?: number
			stage?: number
			url?: boolean
			email?: boolean
			minLength?: number
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
	(e: 'update:selected', value: string): void
}>()
const validators = props.validators
const value = toRef(props, 'value')
const id = props.id

// Ref
const input = ref<HTMLInputElement | null>(null)
const hasFocus = ref(false)
const selected = ref('')
// Composables
const formErrors = useFormErrors()
const forceErrors = useForceErrors()

onMounted(() => {
	if (validators && !formErrors.value.has(id)) {
		const hasErrors = validate(value.value, id, validators, true)

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

// Watch value for search
let timer: NodeJS.Timeout
const elements = ref<Array<{ key: string; value: string }>>([])

watch(value, (newValue) => {
	clearTimeout(timer)
	timer = setTimeout(async () => {
		elements.value = await props.getElements(newValue)
	}, 400)
})

watch(forceErrors, (forceErrors) => {
	if (
		!forceErrors?.namespace ||
		forceErrors.namespace === validators?.namespace
	)
		validate(input.value?.value ?? '', id, validators)
})

function focusout() {
	setTimeout(() => {
		hasFocus.value = false
		validate(selected.value, id, validators)
	}, 300)
}
</script>

<template>
	<div class="Input" @focusin="() => (hasFocus = true)" @focusout="focusout">
		<label v-if="label && label !== ''" :for="id">
			{{ label }}
		</label>
		<input
			:id="id"
			ref="input"
			:class="type === 'color' ? 'Color' : ''"
			:value="value"
			:type="type"
			:placeholder="placeholder"
			:disabled="disabled"
			:style="{ color }"
			@keyup="keyup ?? null"
			@input="
				(e: Event) => {
					$emit('update:value', (e.target as HTMLInputElement).value)
				}
			"
		/>
		<ul v-show="hasFocus" class="List">
			<li v-for="element in elements" :key="element.key">
				<HTMLInvisibleButton
					:click="
						() => {
							$emit('update:value', element.value)
							$emit('update:selected', element.key)
							selected = element.key
						}
					"
				>
					{{ element.value }}
				</HTMLInvisibleButton>
			</li>
		</ul>
		<HTMLErrorMessage :id="id" />
	</div>
</template>

<style>
.Input button {
	width: 100%;
	text-align: left;
}
</style>

<style lang="scss" scoped>
.Input {
	display: flex;
	flex-direction: column;
	width: 100%;
}

input {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	background-color: transparent;
	border: none;
	border: 1px var(--color-light) solid;
	transition: all 0.4s ease-in-out;
	border-radius: 8px;
}

input:focus {
	outline: none;
	border: 1px var(--color-main) solid;
}

ul {
	border: 1px solid var(--color-light);
}

li {
	list-style: none;
	padding: 10px;
	transition: all 0.3s ease;
}

li:hover {
	background-color: var(--color-light);
}

// Media queries
@media (max-width: 767.98px) {
	input {
		padding: 8px;
		font-size: 0.8rem;
	}
	label {
		font-size: 0.9rem;
	}
}

@media (max-width: 575.98px) {
	input {
		padding: 7px;
		font-size: 0.75rem;
		border-bottom: 1px var(--color-light) solid;
	}

	input:focus {
		border-bottom: 1.5px var(--color-main) solid;
		outline: none;
	}
}
</style>
