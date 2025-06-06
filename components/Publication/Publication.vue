<script lang="ts" setup>
import { PhTrashSimple } from '@phosphor-icons/vue'
import type { Publication } from '~/models/publication/publication.model'

const props = defineProps<{
	post: Publication
}>()

const likes = ref(props.post.likes)
const isLiked = ref(false)
const parsedContent = computed(() =>
	props.post.content.replaceAll(/#(\w+)/g, (_, hashtag) => {
		return `<a href="/hashtag/${hashtag}" class="hashtag">#${hashtag}</a>`
	}),
)
const temporalViews = ref<Array<number>>([])

onMounted(async () => {
	const userId = useAuthStore().getID
	let dataFetch = null

	if (useAuthStore().isAuth && userId != null) {
		dataFetch = await useNuxtApp().$profileService.getUserViews(
			userId.toString(),
		)

		isLiked.value = await useNuxtApp()
			.$postService.getMyLike(props.post.id)
			.then(({ isLike }) => isLike)
	} else {
		dataFetch = await useNuxtApp().$profileService.getUserViews(
			useClientStore().getIP,
		)
	}

	if (
		!dataFetch ||
		typeof dataFetch === 'boolean' ||
		!Array.isArray(dataFetch.views)
	) {
		return // Salimos si dataFetch no es válido
	}

	temporalViews.value.push(...dataFetch.views)
})

async function likePost() {
	const value = !isLiked.value
	isLiked.value = value
	if (value) likes.value++
	else likes.value--

	const success = await useNuxtApp().$postService.handleLikePublication(
		props.post.id,
	)
	if (!success) {
		isLiked.value = !value
	}
}

defineEmits<{
	(e: 'delete', v: number): void
}>()

async function onView() {
	const userId = useAuthStore().getID
	let dataFetch = null

	if (useAuthStore().isAuth && userId != null) {
		if (!temporalViews.value?.includes(props.post.id)) {
			await useNuxtApp().$postService.addView(
				props.post.id,
				userId?.toString(),
			)
			dataFetch = await useNuxtApp().$profileService.getUserViews(
				userId.toString(),
			)
		}
	} else {
		if (!temporalViews.value?.includes(props.post.id)) {
			await useNuxtApp().$postService.addView(
				props.post.id,
				useClientStore().getIP,
			)
			dataFetch = await useNuxtApp().$profileService.getUserViews(
				useClientStore().getIP,
			)
		}
	}
	if (
		!dataFetch ||
		typeof dataFetch === 'boolean' ||
		!Array.isArray(dataFetch.views)
	) {
		return
	}

	temporalViews.value.push(...dataFetch.views)
}
const images = computed(() => {
	return [
		...(props.post.images ?? []),
		...(props.post.tattoos?.map(({ image }) => image) ?? []),
	]
})
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
	<IntersectionObserver :options="{ threshold: 0.5 }" @enter="onView">
		<article class="Post">
			<header class="Post__header">
				<HTMLKebabMenu
					v-if="useAuthStore().isOwnProfile"
					:items="[
						{
							icon: PhTrashSimple,
							text: $t('publication.delete'),
							click() {
								$emit('delete', post.id)
							},
						},
					]"
				/>
				<NuxtImg
					:src="post.profile.avatar?.key"
					provider="cloudinary"
				/>
				<div class="Post__text">
					<span>{{ post.profile.user.name }}</span>
					<small
						>@{{ post.profile.user.username }} {{ post.id }}</small
					>
					<p v-html="parsedContent" />
				</div>
			</header>
			<div v-if="images && images.length > 0" class="Post__img">
				<CarouselBasic :images="images.map(({ key }) => key)" />
			</div>
			<footer class="Post__footer">
				<HTMLInvisibleButton
					v-if="useAuthStore().isAuth"
					:click="likePost"
				>
					<i
						class="fa-solid fa-heart"
						:class="{ isLiked: isLiked }"
					/>
					{{ likes }}
				</HTMLInvisibleButton>
				<span v-else>{{ likes }}</span>
				<span>{{ timeAgo(post.createdAt) }}</span>
				<Categories
					v-if="post.categories"
					:categories="post.categories"
				/>
			</footer>
		</article>
	</IntersectionObserver>
</template>

<style>
a {
	text-decoration: none;
}
</style>

<style scoped lang="scss">
.Post {
	box-sizing: border-box;
	max-width: 500px;
	display: flex;
	width: 100%;
	flex-direction: column;
	padding-bottom: 10px;
	border-bottom: 1px solid var(--color-light);
}

.isLiked {
	color: var(--color-main);
}

.Post__header {
	display: flex;
	gap: 10px;
	position: relative;
	img {
		width: 45px;
		height: 45px;
		object-fit: cover;
		border-radius: 100%;
	}
	align-items: center;
}

.Post__img {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 310px;
}

.Post__text {
	display: flex;
	flex-direction: column;
	& p {
		font-size: 0.9rem;
		margin-top: 4px;
		color: var(--color-second);
	}
}

.Post__footer {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 10px;
	span,
	i {
		font-size: 0.8rem;
	}
}
</style>
