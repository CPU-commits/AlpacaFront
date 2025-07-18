<script lang="ts" setup>
// Route
const idStudio = parseInt(useRoute().params.idStudio as string)

if (!useAuthStore().isAuth) {
	useRouter().push(`/register?to-calendar=${idStudio}&studio=true`)
}
// Data
const { data } = await useAsyncData(async (app) => {
	return await Promise.all([
		app?.$studioService.getStudio(idStudio),
		app?.$studioService.getStudioTattooArtists(idStudio),
	])
})
const studio = ref(data.value?.[0])
const tattooArtists = ref(data.value?.[1])
</script>

<template>
	<AppointmentNew
		:username="studio?.username ?? ''"
		:avatar="studio?.avatar?.key"
		:id-studio="idStudio"
		:tattoo-artists="tattooArtists"
	/>
</template>
