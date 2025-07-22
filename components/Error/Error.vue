<script lang="ts" setup>
const { marginTop = true, error } = defineProps<{
	error: unknown
	marginTop?: boolean
}>()

const errorHandled = useNuxtApp().$fetchModule.handleError(error)
</script>

<template>
	<div class="Error" :class="{ MarginTop: marginTop }">
		<img src="@/assets/illustrations/error.webp" alt="Error" />
		<p>{{ errorHandled.message }}</p>
	</div>
</template>

<style scoped>
.Error {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	gap: 10px;
}

.MarginTop {
	margin-top: 100px;
}

img {
	width: 500px;
	border: 1px solid var(--color-light);
}
</style>
