<script setup lang="ts">
import type { Publication } from '~/models/publication/publication.model'

// Stores
const authStore = useAuthStore()
// i18n
const { t } = useI18n()
// Router
const route = useRoute()

const nickname = route.params.nickname as string
// Form
const modalDelete = ref(false)
const idPublication = ref(0)
// Data
const { data } = await useAsyncData(async (app) => {
	return await Promise.all([
		app?.$tattooService.getCategories(),
		app?.$profileService.getProfile(nickname),
	])
})
const { data: tattoos, refresh } = await useAsyncData(async (app) => {
	return await app?.$tattooService.getLatestTattoos(nickname)
})
const categories = ref(data.value?.[0])
const profile = ref(data.value?.[1])
const publications = ref<Array<Publication>>([])
// User
let timer: NodeJS.Timeout | undefined

function updateProfile() {
	if (timer) clearTimeout(timer)

	timer = setTimeout(() => {
		useNuxtApp().$profileService.updateProfile({
			description: profile.value?.description || undefined,
		})
	}, 1000)
}

async function getPosts(page: number) {
	const dataFetch = await useNuxtApp().$postService.getPublications(
		nickname,
		{
			page,
		},
	)
	publications.value.push(...dataFetch.publications)
	return dataFetch
}

onMounted(async () => {
	// Set onscroll
	const dataFetch = await getPosts(0)

	onScroll({
		countReturnedItems: dataFetch.perPage,
		total: dataFetch.total,
		fx: async (page) => await getPosts(page),
	})
})

async function deletePublication() {
	const success = await useNuxtApp().$postService.deletePublication(
		idPublication.value,
	)
	if (success) {
		useToastsStore().addToast({
			message: t('publication.successDelete'),
			type: 'success',
		})
		publications.value = publications.value.filter(
			({ id }) => id !== idPublication.value,
		)
		modalDelete.value = false
	}
}
</script>

<template>
	<NuxtLayout name="profile">
		<ProfileCarousel
			:avatar="profile?.avatar?.key"
			:nickname="nickname"
			:tattoos="tattoos ?? []"
		/>
		<ProfileTools :username="nickname" />
		<header class="Profile__header">
			<!--
			<div class="Profile__header--user">
				<article class="Profile__header--specs">
					<div class="Spec">
						<span>0</span>
						<h3>{{ $t('profile.followers') }}</h3>
					</div>
					<div class="Spec">
						<span>{{ profile?.likes }}</span>
						<h3>{{ $t('profile.likes') }}</h3>
					</div>
				</article>
			</div>-->
			<div class="Profile__header--text">
				<p v-if="profile?.description && !authStore.isOwnProfile">
					{{ profile.description }}
				</p>
				<HTMLTextArea
					v-else-if="authStore.isOwnProfile && profile"
					id="description"
					v-model:value="profile.description"
					:placeholder="$t('profile.noDescription')"
					@update:value="updateProfile"
				/>
				<p v-else>{{ $t('profile.noDescription') }}</p>
				<small>@{{ nickname }}</small>
			</div>
		</header>
		<section class="Profile__content">
			<ProfilePublisher
				v-if="authStore.isOwnProfile"
				:categories="categories ?? []"
				@upload-tattoo="() => refresh()"
			/>
			<section v-if="publications" class="Profile__posts">
				<Publication
					v-for="post in publications"
					:key="post.id"
					:post="post"
					@delete="
						(id) => {
							modalDelete = true
							idPublication = id
						}
					"
				/>
			</section>
			<p v-else>{{ $t('profile.noPublications') }}</p>
		</section>

		<Modal v-model:opened="modalDelete">
			<template #title>
				<h2>Eliminar</h2>
			</template>
			<ModalButtons>
				<HTMLButton
					type="button"
					:without-background="true"
					:click="() => (modalDelete = false)"
				>
					{{ $t('common.cancel') }}
				</HTMLButton>
				<HTMLButton type="button" :click="deletePublication">
					{{ $t('publication.deletePublication') }}
				</HTMLButton>
			</ModalButtons>
		</Modal>
	</NuxtLayout>
</template>

<style scoped lang="scss">
.Profile__header {
	display: flex;
	width: 100%;
	flex-direction: column;
	justify-content: center;
	max-width: 600px;
}

.Profile__header--user {
	display: flex;
}

.Profile__header--specs {
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	width: 100%;
	h3 {
		font-size: 0.9rem;
	}
	.Spec {
		display: flex;
		flex-direction: column;
		align-items: center;
		span {
			color: var(--color-black);
			font-size: 0.85rem;
		}
	}
}

.Profile__header--text {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 5px;
	padding: 10px;
	p {
		color: var(--color-black);
		font-size: 0.9rem;
	}
}

.Profile__inventory {
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
	flex-direction: column;
}

.Profile__content {
	max-width: 700px;
	width: 100%;
}

.Profile__posts {
	position: relative;
	width: 100%;
	display: flex;
	gap: 2rem;
	padding: 1rem;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
