<script lang="ts" setup>
import type { Profile } from '~/models/user/profile.model'

defineProps<{
	profile: Profile
}>()
</script>

<template>
	<NuxtLink :to="`/${profile.user.username}`" class="Profile">
		<ProfileAvatar :avatar="profile.avatar?.key" />

		<span>{{ profile.user.name }}</span>
		<span class="Username">@{{ profile.user.username }}</span>
	</NuxtLink>
</template>

<style scoped>
.Profile {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 5px;
	transition: all 0.4s ease;
	padding: 10px;
	border-radius: 8px;
}

.Profile:hover {
	box-shadow: var(--box-shadow);
}
</style>
