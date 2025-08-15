<script setup lang="ts">
import type { Publication } from '~/models/publication/publication.model'
import { UserTypesKeys } from '~/models/user/user.model'

// Stores
const authStore = useAuthStore()
// Router
const route = useRoute()

const nickname = route.params.nickname as string
// Data
const { data, error } = await useAsyncData(async (app) => {
	return await Promise.all([app?.$profileService.getProfile(nickname)])
})
const { data: tattoos, refresh } = await useAsyncData(async (app) => {
	return await app?.$tattooService.getLatestTattoos({
		username: nickname,
	})
})
const profile = ref(data.value?.[0])
const publications = ref<Array<Publication>>([])
const media = computed(() => profile.value?.user.media)
// SEO
const { t } = useI18n()

const seoMeta = buildSeoMeta({
	title: nickname,
	description: profile.value?.description ?? t('profile.noDescription'),
	ogType: 'profile',
	ogImage: {
		key: profile.value?.avatar?.key,
	},
	ogUrlPath: `/${nickname}`,
	ogImageAlt: profile.value?.avatar?.key
		? t('profile.metadata.logo', { name: nickname })
		: t('common.altFullLogo'),
	profile: {
		firstName: profile.value?.user.name ?? '',
		username: nickname,
	},
})
useSeoMeta(seoMeta)

useJsonld({
	'@context': 'https://schema.org',
	'@type': 'Person',
	name: profile.value?.user.name,
	url: seoMeta.ogUrl,
	image: seoMeta.ogImage,
	sameAs: media.value?.map(({ link }) => link),
	jobTitle: t('profile.metadata.job'),
})
// User
let timer: NodeJS.Timeout | undefined

function updateProfile() {
	if (timer) clearTimeout(timer)

	timer = setTimeout(() => {
		useNuxtApp().$profileService.updateProfile({
			description: profile.value?.description ?? undefined,
		})
	}, 1000)
}
</script>

<template>
	<NuxtLayout name="profile">
		<ErrorWrapper :errors="[error]">
			<ProfileCarousel
				:avatar="profile?.avatar?.key"
				:nickname="nickname"
				:tattoos="tattoos ?? []"
			/>
			<StudioMedia v-if="media" :media="media" />
			<ProfileTools
				:username="nickname"
				:is-tattoo-artist="
					profile?.user?.roles?.includes(
						UserTypesKeys.TATTOO_ARTIST,
					) ?? false
				"
			/>
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
						:validators="{
							maxLength: 500,
						}"
						@update:value="updateProfile"
					/>
					<p v-else>{{ $t('profile.noDescription') }}</p>
					<small>{{ profile?.user.name }} - @{{ nickname }}</small>
				</div>
			</header>
			<section class="Profile__content">
				<ProfilePublisher
					v-if="authStore.isOwnProfile"
					@upload-tattoo="() => refresh()"
					@upload-publication="
						(publication) => publications.unshift(publication)
					"
				/>
				<PublicationPublications
					v-model:publications="publications"
					:params="{ username: nickname }"
				/>
			</section>
		</ErrorWrapper>
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
		word-wrap: break-word;
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
</style>
