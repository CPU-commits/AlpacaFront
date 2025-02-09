<script lang="ts" setup>
// Types
import { PhUser } from '@phosphor-icons/vue'
import type { Tattoo } from '~/models/tattoo/tattoo.model'
import { UserTypesKeys } from '~/models/user/user.model'
// Props
const props = defineProps<{
	nickname: string
	tattoos: Array<Tattoo>
	avatar?: string
}>()
// Stores
const authStore = useAuthStore()
// Form
const onClickInput = ref(() => {})
// Data
const avatarURL = ref(props.avatar)

function getTattoo(index: number) {
	return props.tattoos.at(index)?.image.key
}

function changeProfileImg() {
	if (authStore.isOwnProfile) {
		onClickInput.value()
	}
}

async function uploadProfileImg(files: Array<File>) {
	const key = await useNuxtApp().$profileService.changeAvatar(files[0])
	if (key) {
		avatarURL.value = key.key
	}
}
</script>

<template>
	<section class="Carousel">
		<div
			v-for="tattoo in 5"
			:key="tattoo"
			class="Carousel__block"
			:class="{
				Main: tattoo === 1,
				CornetTop: tattoo === 3,
				CornetBottom: tattoo === 5,
			}"
		>
			<NuxtImg
				:src="getTattoo(tattoo - 1) ?? '/img/alpaca.jpg'"
				alt="Tatuaje"
				:provider="getTattoo(tattoo - 1) ? 'cloudinary' : undefined"
				:class="{
					Main: tattoo === 1,
					CornetTop: tattoo === 3,
					CornetBottom: tattoo === 5,
				}"
			/>
			<NuxtLink
				v-if="tattoo === 5"
				class="Carousel__gallery"
				:to="`${nickname}/gallery`"
			>
				<aside>
					<i class="fa-solid fa-images"></i>
				</aside>
			</NuxtLink>
		</div>

		<HTMLInvisibleButton class="AvatarButton" :click="changeProfileImg">
			<NuxtImg
				v-if="avatarURL"
				:src="avatarURL"
				class="Avatar"
				alt="Avatar"
				provider="cloudinary"
			/>
			<PhUser v-else class="Avatar" :size="80" />
			<aside
				v-if="
					authStore.userRoleIs(UserTypesKeys.TATTOO_ARTIST) &&
					authStore.isOwnProfile
				"
				class="AvatarUser"
			>
				<i class="fa-solid fa-file-arrow-up"></i>
			</aside>
			<HTMLInvisibleInputFile
				accept="image/png, image/gif, image/jpeg"
				:filter="{
					message: $t('profile.onlyAcceptImage'),
					type: /^image\/(png|jpeg|jpg|gif|webp|bmp|tiff|svg\+xml)$/,
				}"
				:on-change="uploadProfileImg"
				@on-click="(onClick) => (onClickInput = onClick)"
			/>
		</HTMLInvisibleButton>
	</section>
</template>

<style scoped lang="scss">
.Carousel {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	grid-template-areas:
		'Main Main . .'
		'Main Main . .';
	gap: 10px;
	position: relative;
	width: 100%;
}

.Carousel__block {
	position: relative;
	max-height: 160px;
}

img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	aspect-ratio: 16/12;
}

.Main {
	grid-area: Main;
	border-top-left-radius: 14px;
	border-bottom-left-radius: 14px;
	max-height: 330px;
}

.CornetTop {
	border-top-right-radius: 14px;
}

.CornetBottom {
	border-bottom-right-radius: 14px;
}

.Carousel__gallery {
	position: absolute;
	background-color: rgba(0, 0, 0, 0.5);
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom-right-radius: 14px;
	i {
		font-size: 2.5rem;
	}
}

.AvatarButton {
	position: absolute;
	width: fit-content;
	width: 100px;
	height: 100px;
	bottom: -10px;
	left: -10px;
}

.Avatar {
	object-fit: cover;
	border-radius: 80%;
	box-shadow: var(--box-shadow);
	padding: 2px;
	background-color: var(--color-bg);
}

.AvatarUser {
	left: 0;
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 80%;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.4s;
	visibility: hidden;
}

.AvatarButton:hover .AvatarUser {
	visibility: visible;
	background-color: rgba(0, 0, 0, 0.5);
}
</style>
