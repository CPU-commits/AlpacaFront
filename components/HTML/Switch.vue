<script lang="ts" setup>
defineProps<{
	id: string
	label: string
	checked?: boolean
}>()

defineEmits<{
	(e: 'update:checked', v: boolean): void
}>()
</script>

<template>
	<label class="switch" :for="id">
		<input
			:id="id"
			type="checkbox"
			class="checkbox"
			:checked="checked"
			@change="
				(e: Event) =>
					$emit(
						'update:checked',
						(e.target as HTMLInputElement).checked,
					)
			"
		/>
		<div class="slider"></div>
		<span>{{ label }}</span>
	</label>
</template>

<style scoped>
.switch {
	display: flex;
	gap: 5px;
	align-items: center;
	justify-content: center;
}

.checkbox {
	display: none;
}

span {
	text-align: center;
}

.slider {
	width: 60px;
	height: 30px;
	background-color: var(--color-light);
	border-radius: 20px;
	overflow: hidden;
	display: flex;
	align-items: center;
	border: 4px solid transparent;
	transition: 0.3s;
	cursor: pointer;
}

.slider::before {
	content: '';
	display: block;
	width: 100%;
	height: 100%;
	background-color: white;
	transform: translateX(-30px);
	border-radius: 20px;
	transition: 0.3s;
}

.checkbox:checked ~ .slider::before {
	transform: translateX(30px);
}

.checkbox:checked ~ .slider {
	background-color: var(--color-main);
}

.checkbox:active ~ .slider::before {
	transform: translate(0);
}
</style>
