<script setup lang="ts">
const error = useError()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
	<NuxtLayout>
		<section class="Error">
			<Illustration
				illustration="error"
				:text="(error?.data as any)?.message ?? $t('errors.generic')"
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
