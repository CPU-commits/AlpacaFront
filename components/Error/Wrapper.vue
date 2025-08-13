<script lang="ts" setup>
const { errors, throwErr } = defineProps<{
	errors?: Array<unknown | undefined>
	throwErr?: boolean
}>()

const firstError = computed(() => errors?.find((err) => err))
if (firstError.value && throwErr) {
	throw createError(firstError.value)
}
</script>

<template>
	<div v-if="firstError" class="Error">
		<Error :error="firstError" />
	</div>
	<slot v-else />
</template>
