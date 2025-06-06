<script lang="ts" setup>
// Stores
const authStore = useAuthStore()

const { data: profile } = await useAsyncData(
	async (app) => {
		const username = authStore.getUser?.user.username
		if (!username) return null

		const profile = await app?.$profileService.getProfile(username)
		return profile
	},
	{ watch: [useAuthStore()] },
)
</script>

<template>
	<header class="Header">
		<NuxtImg class="Header__logo" src="/img/logo.svg" />
		<NuxtLink class="Header__title" to="/">
			<NuxtImg src="/img/logoFull.svg" />
		</NuxtLink>

		<div class="Header__icons">
			<HTMLAnchorButton
				v-if="!authStore.isAuth"
				to="/login"
				:primary="false"
			>
				Iniciar sesión
			</HTMLAnchorButton>
			<HTMLAnchorButton
				v-if="!authStore.isAuth"
				to="/register"
				:primary="true"
			>
				Registrarse
			</HTMLAnchorButton>
			<HTMLAnchorButton
				v-else
				class="AvatarIcon"
				:to="`/${useAuthStore().getUser?.user.username}`"
			>
				<ProfileAvatar
					v-if="profile?.avatar"
					:avatar="profile.avatar.key"
				/>
			</HTMLAnchorButton>
		</div>
	</header>
</template>

<style scoped>
.Header {
	display: flex;
	width: 100%;
	padding: 20px;
	justify-content: space-between;
	font-size: 1.2rem;
	align-items: center;
	position: relative;
}

.Header__logo {
	width: 50px;
}

.Header__title {
	position: absolute;
	left: 0;
	right: 0;
	text-decoration: none;
	margin: 0 auto;
	width: fit-content;
	img {
		width: 130px;
		padding: 10px;
	}
}

.Header__icons {
	display: flex;
	gap: 10px;
}

.AvatarIcon {
	padding: 0;
}
</style>
