<script lang="ts" setup>
import type { Component } from 'vue'

defineProps<{
	checked: string
	items: Array<{
		name: string
		value: string
		icon?: Component
	}>
}>()

defineEmits<{
	(e: 'update:checked', v: string): void
}>()
</script>

<template>
	<div class="radio-inputs">
		<label v-for="(item, i) in items" :key="i" class="radio">
			<input
				type="radio"
				name="radio"
				:checked="checked === item.value"
				@change="() => $emit('update:checked', item.value)"
			/>
			<div class="name">
				<component :is="item.icon" v-if="item.icon" :size="20" />
				<span>{{ item.name }}</span>
			</div>
		</label>
	</div>
</template>

<style scoped>
.radio-inputs {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	border-radius: 0.5rem;
	background-color: var(--color-light);
	box-sizing: border-box;
	padding: 0.25rem;
	font-size: 14px;
}

.radio-inputs .radio {
	flex: 1 1 auto;
	text-align: center;
}

.radio-inputs .radio input {
	display: none;
}

.radio-inputs .radio .name {
	display: flex;
	cursor: pointer;
	align-items: center;
	justify-content: center;
	border-radius: 0.5rem;
	border: none;
	padding: 0.5rem 0;
	transition: all 0.15s ease-in-out;
	gap: 5px;
}

.radio input:checked + .name {
	background-color: var(--color-bg);
	font-weight: 600;
}
</style>
