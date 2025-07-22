<script lang="ts" setup>
definePageMeta({
	auth: true,
	middleware: 'owner',
})
</script>

<template>
	<NuxtLayout name="panel">
		<Illustration illustration="stonks" :margin-top="false" />
	</NuxtLayout>
</template>
