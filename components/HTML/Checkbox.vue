<script lang="ts" setup>
defineProps<{
	id: string
	value: string
	label: string
	selected: boolean
}>()

defineEmits<{
	(e: 'update:selected', v: boolean): void
}>()
</script>

<template>
	<div class="Checkbox" :class="{ Selected: selected }">
		<input
			:id="id"
			type="checkbox"
			:value="value"
			:checked="selected"
			@change="() => $emit('update:selected', !selected)"
		/>
		<label :for="id">{{ label }}</label>
	</div>
</template>

<style scoped lang="scss">
.Checkbox {
	display: flex;
	padding: 10px;
	border: 1px solid var(--color-light);
	border-radius: 25px;
	transition: all 0.4s ease;
}

.Selected {
	background-color: var(--colo-main);
	label {
		color: var(--color-with-main);
	}
}

.Checkbox:hover {
	box-shadow: var(--box-shadow);
	border-color: transparent;
}

input {
	display: none;
}
</style>
