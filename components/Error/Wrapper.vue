<script lang="ts" setup>
const { errors } = defineProps<{
	errors?: Array<unknown | undefined>
}>()

const firstError = computed(() => errors?.find((err) => err))
</script>

<template>
	<div v-if="firstError" class="Error">
		<Error :error="firstError" />
	</div>
	<slot v-else />
</template>
