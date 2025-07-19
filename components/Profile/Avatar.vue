<script lang="ts" setup>
const {
	retrieveAvatar,
	avatar: externalAvatar,
	boxShadow = true,
	priority = 'avatar',
} = defineProps<{
	avatar?: string
	retrieveAvatar?: {
		idUser?: number
	}
	size?: 'normal' | 'xl' | 's'
	boxShadow?: boolean
	src?: string
	priority?: 'avatar' | 'src'
}>()
const avatar = ref(externalAvatar)
const externalAvatarRef = toRef(() => externalAvatar)

watch(externalAvatarRef, (a) => {
	avatar.value = a
})

onBeforeMount(async () => {
	if (externalAvatar) return

	if (retrieveAvatar?.idUser) {
		const retrievedAvatar = await useNuxtApp().$profileService.getAvatar(
			retrieveAvatar.idUser,
		)
		avatar.value = retrievedAvatar
	}
})
</script>

<template>
	<div
		class="AvatarContainer"
		:class="{ Xl: size === 'xl', S: size === 's' }"
	>
		<NuxtImg
			v-if="(avatar && priority === 'avatar') || (!src && avatar)"
			:src="avatar"
			class="Avatar"
			:class="{ BoxShadow: boxShadow }"
			alt="Avatar"
			provider="cloudinary"
		/>
		<img
			v-else-if="(src && priority === 'src') || (!avatar && src)"
			:src="src"
			class="Avatar"
			:class="{ BoxShadow: boxShadow }"
			alt="Avatar Source"
		/>
		<img
			v-else-if="size === 'normal'"
			class="Avatar"
			:class="{ BoxShadow: boxShadow }"
			src="@/assets/skeleton/avatar-60x60.webp"
			alt="Avatar"
		/>
		<img
			v-else
			class="Avatar"
			:class="{ BoxShadow: boxShadow }"
			src="@/assets/skeleton/avatar-80x80.webp"
			alt="Avatar"
		/>
	</div>
</template>

<style scoped>
.AvatarContainer {
	width: fit-content;
	width: 60px;
	height: 60px;
}

.Avatar {
	object-fit: cover;
	border-radius: 80%;
	padding: 2px;
	background-color: var(--color-bg);
}

.BoxShadow {
	box-shadow: var(--box-shadow);
}

.Xl {
	width: 80px;
	height: 80px;
}

.S {
	width: 50px;
	height: 50px;
}

img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	aspect-ratio: 16/12;
}
</style>
