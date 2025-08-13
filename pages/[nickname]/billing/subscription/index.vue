<script lang="ts" setup>
definePageMeta({
	auth: true,
	middleware: 'owner',
})

// Meta
useSeoMeta(seoMetaNoIndex())
</script>

<template>
	<NuxtLayout name="panel">
		<SubscriptionHandle />
	</NuxtLayout>
</template>
