<script lang="ts" setup>
// Route
const nickname = useRoute().params.nickname as string

if (!useAuthStore().isAuth) {
	useRouter().push(`/register?to-calendar=${nickname}`)
}
// Data
const { data, error } = await useAsyncData(async (app) => {
	return await Promise.all([app?.$profileService.getProfile(nickname)])
})
const profile = ref(data.value?.[0])
</script>

<template>
	<ErrorWrapper :errors="[error]">
		<AppointmentNew
			:avatar="profile?.avatar?.key"
			:username="profile?.user.username ?? ''"
			:id-tattoo-artist="profile?.user.id"
		/>
	</ErrorWrapper>
</template>
