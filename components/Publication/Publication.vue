<script lang="ts" setup>
import { PhTrashSimple } from '@phosphor-icons/vue'
import type { Publication } from '~/models/publication/publication.model'
import type { Views } from '~/models/publication/view.model'
import { EDIT_PUBLICATIONS_PERMISSION } from '~/models/studio/permission.model'

const props = defineProps<{
	post: Publication
}>()
// i18n
const { t } = useI18n()
// Stores
const authStore = useAuthStore()
const clientStore = useClientStore()

const likes = ref(props.post.likes)
const isLiked = ref(false)
const parsedContent = computed(() =>
	props.post.content.replaceAll(/#(\w+)/g, (_, hashtag) => {
		return `<a href="/hashtag/${hashtag}" class="hashtag">#${hashtag}</a>`
	}),
)
const temporalViews = ref<Views['views']>()

async function getTemporalViews(indentifier: string) {
	const resViews =
		await useNuxtApp().$profileService.getUserViews(indentifier)

	return resViews.body
}

onMounted(async () => {
	if (authStore.isAuth && authStore.getID != null) {
		temporalViews.value = await getTemporalViews(authStore.getID.toString())

		const resLike = await useNuxtApp().$postService.getMyLike(props.post.id)
		isLiked.value = resLike.body
	} else {
		temporalViews.value = await getTemporalViews(clientStore.getIP)
	}
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
	if (
		authStore.isAuth &&
		authStore.getID != null &&
		temporalViews.value != null
	) {
		const viewed = temporalViews?.value.includes(props.post.id)
		if (!viewed) {
			await useNuxtApp().$postService.addView(props.post.id, {
				identifier: authStore.getID.toString(),
			})
			temporalViews.value = await getTemporalViews(
				authStore.getID.toString(),
			)
		}
	} else if (temporalViews.value != null) {
		const viewed = temporalViews?.value.includes(props.post.id)
		if (!viewed && authStore.getID != null) {
			await useNuxtApp().$postService.addView(props.post.id, {
				identifier: authStore.getID.toString(),
			})
			temporalViews.value = await getTemporalViews(clientStore.getIP)
		}
	}
}

const images = computed(() => {
	return [
		...(props.post.images ?? []),
		...(props.post.tattoos?.map(({ image }) => image) ?? []),
	]
})

function share() {
	navigator.clipboard
		.writeText(`${useRuntimeConfig().public.URL_CLIENT}/p/${props.post.id}`)
		.then(() =>
			useToastsStore().addToast({
				message: t('publication.successShare'),
				type: 'success',
				timeout: 1000,
			}),
		)
		.catch(() =>
			useToastsStore().addToast({
				message: t('publication.failShare'),
				type: 'error',
				timeout: 1000,
			}),
		)
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
	<IntersectionObserver :options="{ threshold: 0.5 }" @enter="onView">
		<article class="Post">
			<header class="Post__header">
				<HTMLKebabMenu
					v-if="
						useAuthStore().isOwnProfile ||
						(useAuthStore().getID === post.profile.user.id &&
							useStudioPermissionsStore().isAdmin) ||
						useStudioPermissionsStore().userHasPermission(
							EDIT_PUBLICATIONS_PERMISSION,
						)
					"
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
					<small>@{{ post.profile.user.username }}</small>
					<p v-html="parsedContent" />
				</div>
			</header>
			<div v-if="images && images.length > 0" class="Post__img">
				<CarouselBasic :images="images.map(({ key }) => key)" />
			</div>
			<footer class="Post__footer">
				<div class="Post__footer--left">
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
					<span v-else
						><i
							class="fa-solid fa-heart"
							:class="{ isLiked: isLiked }"
						/>
						{{ likes }}</span
					>
					<span>{{ timeAgo(post.createdAt) }}</span>
					<Categories
						v-if="post.categories"
						:categories="post.categories"
					/>
				</div>
				<div class="Post__footer--right">
					<HTMLSimpleButton :click="share" type="button">
						<i class="fa-solid fa-share"></i>
					</HTMLSimpleButton>
				</div>
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
	justify-content: space-between;
	margin-top: 10px;
	span,
	i {
		font-size: 0.8rem;
	}
}

.Post__footer--left,
.Post__footer--right {
	display: flex;
	align-items: center;
	gap: 10px;
}

.Post__footer--right i {
	font-size: 0.9rem;
}
</style>
