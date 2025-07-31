<script lang="ts" setup>
definePageMeta({
	auth: true,
	middleware: 'owner',
})
// Params
const username = useRoute().params.nickname as string
// Profile
const { data: media } = useAsyncData(
	async (app) => {
		return await app?.$profileService
			.getProfile(username)
			.then(({ user }) => user.media)
	},
	{ server: false },
)
</script>

<template>
	<NuxtLayout name="panel">
		<Metrics :username="username" :media="media ?? []" />
	</NuxtLayout>
</template>
