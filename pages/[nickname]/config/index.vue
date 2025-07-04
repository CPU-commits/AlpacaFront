<script lang="ts" setup>
definePageMeta({
	auth: true,
	middleware: 'owner',
})
</script>

<template>
	<NuxtLayout name="profile">
		<ProfileConfig />
	</NuxtLayout>
</template>
