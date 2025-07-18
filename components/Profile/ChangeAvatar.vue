<script lang="ts" setup>
const props = defineProps<{
	action: (file: File) => any
	avatar?: string
}>()

const onClickInput = ref(() => {})

const src = ref<undefined | string>(undefined)

function changeProfileImg() {
	if (useAuthStore().isOwnProfile || useStudioPermissionsStore().isAdmin) {
		onClickInput.value()
	}
}

function onChangeFile(files: Array<File>) {
	const file = files.at(0)
	if (!file) return

	const reader = new FileReader()
	reader.readAsDataURL(file)
	reader.onload = (e) => {
		const target = e.target
		src.value = target?.result?.toString() ?? ''
	}

	props.action(file)
}
</script>

<template>
	<HTMLInvisibleButton class="AvatarButton" :click="changeProfileImg">
		<ProfileAvatar
			:key="avatar"
			:src="src"
			size="xl"
			class="Avatar"
			priority="src"
		/>
		<aside
			v-if="
				useAuthStore().isOwnProfile ||
				useStudioPermissionsStore().isAdmin
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
			:on-change="onChangeFile"
			@on-click="(onClick) => (onClickInput = onClick)"
		/>
	</HTMLInvisibleButton>
</template>

<style scoped>
.AvatarButton {
	width: 80px;
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.Avatar {
	object-fit: cover;
	border-radius: 80%;
	box-shadow: var(--box-shadow);
	padding: 2px;
	background-color: var(--color-bg);
	height: 100%;
	width: 100%;
}

.AvatarButton:hover .AvatarUser {
	visibility: visible;
	background-color: rgba(0, 0, 0, 0.5);
}

.AvatarUser {
	position: absolute;
	inset: 0;
	border-radius: 80%;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.4s;
	visibility: hidden;
	i {
		font-size: 1.5rem;
	}
}
</style>
