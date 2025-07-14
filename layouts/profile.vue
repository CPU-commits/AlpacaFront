<script setup lang="ts">
import { UserTypesKeys } from '~/models/user/user.model'
useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)
</script>

<template>
	<section class="Profile">
		<template
			v-if="
				useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST) ||
				!useAuthStore().isOwnProfile
			"
		>
			<slot />
		</template>
		<NuxtLayout v-else name="panel">
			<ProfileConfig />
		</NuxtLayout>
	</section>
</template>

<style scoped>
.Profile {
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
	width: 100%;
	max-width: 1000px;
}
</style>
