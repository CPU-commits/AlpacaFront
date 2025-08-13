<script setup lang="ts">
const error = useError()

const handleError = () => clearError({ redirect: '/' })
const message = computed(() => {
	const data = error.value?.data as any

	if (data && typeof data === 'string') {
		const jsonData = JSON.parse(data)

		return jsonData?.message ?? jsonData?.title
	}
	if (typeof data === 'object') return data?.message ?? data?.title

	return undefined
})
</script>

<template>
	<NuxtLayout>
		<section class="Error">
			<Illustration
				illustration="error"
				:text="message ?? $t('errors.generic')"
			/>

			<footer>
				<HTMLButton type="button" :click="handleError">
					{{ $t('errors.back') }}
				</HTMLButton>
			</footer>
		</section>
	</NuxtLayout>
</template>

<style scoped>
.Error {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
