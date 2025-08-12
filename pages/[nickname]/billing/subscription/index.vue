<script lang="ts" setup>
definePageMeta({
	auth: true,
	middleware: 'owner',
})
</script>

<template>
	<NuxtLayout name="panel">
		<SubscriptionHandle />
	</NuxtLayout>
</template>
