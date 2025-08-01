<script lang="ts" setup>
import { PhTrashSimple } from '@phosphor-icons/vue'
import { db } from '@/databases/db'
import type { Publication } from '~/models/publication/publication.model'
import { EDIT_PUBLICATIONS_PERMISSION } from '~/models/studio/permission.model'
import { TTL_MS, type View } from '~/models/publication/view.model'
import type { Share } from '~/models/publication/share.model'

const props = defineProps<{
	post: Publication
	onlyShow?: boolean
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
const publicationViewId = `publication-${props.post.id}`
let view: View | undefined
let shared: Share | undefined

onBeforeMount(async () => {
	view = await db.views.get(publicationViewId)
	shared = await db.shares.get(publicationViewId)

	if (authStore.isAuth && authStore.getID !== null && !props.onlyShow) {
		const resLike = await useNuxtApp().$postService.getMyLike(props.post.id)
		isLiked.value = resLike.body
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
	if (props.onlyShow) return

	if (!view) {
		const newView = {
			id: publicationViewId,
			timestamp: Date.now(),
			ttl: TTL_MS,
		}
		view = newView

		await db.views.add(newView)
		await useNuxtApp().$postService.addView(props.post.id, {
			identifier: clientStore.getIdentifier,
			identifierType: clientStore.getIdentifierType,
		})
	}
}

const images = computed(() => {
	return [
		...(props.post.images ?? []),
		...(props.post.tattoos?.map(({ image }) => image) ?? []),
	]
})

async function share() {
	if (!shared && useAuthStore().isAuth && useAuthStore().getID !== null) {
		const newShared = {
			id: publicationViewId,
			timestamp: Date.now(),
		}

		useNuxtApp()
			.$postService.share(props.post.id)
			.then(async (success) => {
				if (success) {
					shared = newShared

					await db.shares.add(newShared)
				}
			})
	}

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
						(!onlyShow && useAuthStore().isOwnProfile) ||
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
					<template v-if="!onlyShow">
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
					</template>
					<span>{{ timeAgo(post.createdAt) }}</span>
					<Categories
						v-if="post.categories"
						:categories="post.categories"
					/>
				</div>
				<div v-if="!onlyShow" class="Post__footer--right">
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
