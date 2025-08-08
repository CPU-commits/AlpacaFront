<script lang="ts" setup>
definePageMeta({
	auth: true,
})

const idStudio = parseInt(useRoute().params.idStudio as string)
</script>

<template>
	<NuxtLayout name="studio">
		<SubscriptionHandle :id-studio="idStudio" />
	</NuxtLayout>
</template>
