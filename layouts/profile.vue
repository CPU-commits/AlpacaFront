<script setup lang="ts">
import { UserTypesKeys } from '~/models/user/user.model'
</script>

<template>
	<section class="Profile">
		<template v-if="useAuthStore().userRoleIs(UserTypesKeys.TATTOO_ARTIST)">
			<slot />
		</template>
		<ProfileConfig v-else />
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
