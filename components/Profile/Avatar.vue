<script lang="ts" setup>
import { PhUser } from '@phosphor-icons/vue'

defineProps<{
	avatar?: string
}>()
</script>

<template>
	<div class="AvatarContainer">
		<NuxtImg
			v-if="avatar"
			:src="avatar"
			class="Avatar"
			alt="Avatar"
			provider="cloudinary"
		/>
		<PhUser v-else class="Avatar" :size="60" />
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

img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	aspect-ratio: 16/12;
}
</style>
