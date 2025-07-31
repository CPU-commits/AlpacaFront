<script lang="ts" setup>
definePageMeta({
	auth: true,
})

const idStudio = parseInt(useRoute().params.idStudio as string)
// Data
const { data } = await useAsyncData(async (app) => {
	return await app?.$studioService.getStudio(idStudio)
})
</script>

<template>
	<NuxtLayout name="studio">
		<div class="Metrics">
			<Metrics :id-studio="idStudio" :media="data?.media ?? []" />
		</div>
	</NuxtLayout>
</template>

<style scoped>
.Metrics {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
