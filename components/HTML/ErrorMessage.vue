<script lang="ts" setup>
defineProps<{
	id: string
}>()
// Composables
const errors = useFormErrors()
</script>

<template>
	<small v-for="(error, i) in errors.get(id)?.errors" :key="i">
		{{ error }}
	</small>
</template>

<style scoped>
small {
	font-style: italic;
	color: var(--color-danger);
}
</style>
