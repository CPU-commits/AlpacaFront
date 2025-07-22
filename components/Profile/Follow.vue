<script lang="ts" setup>
const { toFollow } = defineProps<{
	toFollow: {
		idStudio?: number
		username?: string
	}
}>()

const isFollowed = ref<boolean | null>(null)
const isClicked = ref(false)

onBeforeMount(async () => {
	isFollowed.value = await useNuxtApp().$followService.getMyFollow(toFollow)
})

async function toggleFollow() {
	const success = await useNuxtApp().$followService.toggleFollow(
		toFollow,
		!isFollowed.value,
	)
	isFollowed.value = !isFollowed.value
	if (!success) {
		isFollowed.value = !isFollowed.value
	}
}
</script>

<template>
	<button
		v-if="useAuthStore().isAuth && isFollowed !== null"
		:class="{ clicked: isClicked, Followed: isFollowed }"
		@mousedown="isClicked = true"
		@animationend="isClicked = false"
		@click="toggleFollow()"
	>
		<i v-if="!isFollowed" class="fa-solid fa-user-plus"></i>
		<i v-else class="fa-solid fa-check"></i>
		{{ !isFollowed ? $t('profile.follow') : $t('profile.following') }}
	</button>
</template>

<style scoped lang="scss">
button {
	background-color: transparent;
	border: 1px solid var(--color-main);
	padding: 5px;
	margin-top: 5px;
	border-radius: 8px;
	max-width: 200px;
	transition: all 0.4s ease;
	&,
	i {
		color: var(--color-main);
		transition: all 0.4s ease;
	}
}

button:hover {
	background-color: var(--color-second);
	border: 1px solid var(--color-text-with-second);
	&,
	i {
		color: var(--color-text-with-second);
	}
}

button.clicked {
	animation: click-bounce 300ms ease;
}

.Followed {
	background-color: var(--color-second);
	border: 1px solid var(--color-text-with-second);
	&,
	i {
		color: var(--color-text-with-second);
	}
}

@keyframes click-bounce {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(0.95);
	}
	100% {
		transform: scale(1);
	}
}
</style>
