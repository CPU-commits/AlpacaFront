<script lang="ts" setup>
import type { Tattoo } from '~/models/tattoo/tattoo.model'

const props = defineProps<{
	tattoo: Tattoo
}>()
// i18n
const { t } = useI18n()

// Content
const parsedContent = computed(() =>
	props.tattoo.description?.replaceAll(/#(\w+)/g, (_, hashtag) => {
		return `<a href="/hashtag/${hashtag}" class="hashtag">#${hashtag}</a>`
	}),
)
const urlTattoo = computed(
	() =>
		`${useRuntimeConfig().public.URL_CLIENT}/p/${props.tattoo.idPublication}?idTattoo=${props.tattoo.id}`,
)

function share() {
	navigator.clipboard
		.writeText(urlTattoo.value)
		.then(() =>
			useToastsStore().addToast({
				message: t('tattoo.successShare'),
				type: 'success',
				timeout: 1200,
			}),
		)
		.catch(() =>
			useToastsStore().addToast({
				message: t('tattoo.failShare'),
				type: 'error',
				timeout: 1200,
			}),
		)
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
	<article class="Tattoo">
		<header>
			<NuxtImg
				:src="tattoo.image.key"
				provider="cloudinary"
				loading="lazy"
			/>
		</header>
		<footer class="Tattoo__Footer">
			<header class="Tattoo__Footer--header">
				<NuxtImg
					:src="tattoo.profile.avatar?.key"
					provider="cloudinary"
				/>
				<div class="Tattoo__header--text">
					<span>{{ tattoo.profile.user.name }}</span>
					<small>@{{ tattoo.profile.user.username }}</small>
				</div>
			</header>
			<p v-if="parsedContent" v-html="parsedContent" />
			<div class="Tattoo__Footer--metadata">
				<div class="Tattoo__metadata--left">
					<span
						><i class="fa-solid fa-chart-simple"></i>
						{{ tattoo.views }}</span
					>
					<span
						><i class="fa-solid fa-heart"></i>
						{{ tattoo.likes }}</span
					>
					<span>{{ timeAgo(tattoo.createdAt) }}</span>

					<Categories
						v-if="tattoo.categories"
						:categories="tattoo.categories"
					/>
					<HTMLSimpleAnchor
						:to="`/search?kind=tattoo&isLikeidTattoo=${tattoo.id}`"
					>
						<i class="fa-solid fa-magnifying-glass"></i>
						{{ $t('tattoo.searchSimilar') }}
					</HTMLSimpleAnchor>
				</div>
				<div class="Tattoo__metadata--right">
					<HTMLSimpleButton :click="share" type="button">
						<i class="fa-solid fa-share"></i>
					</HTMLSimpleButton>
				</div>
			</div>
			<div class="Tattoo__Footer--Goto">
				<HTMLSimpleAnchor
					:to="urlTattoo"
					target="_blank"
					rel="external"
				>
					{{ $t('tattoo.goToPublication') }}
					<i class="fa-solid fa-arrow-up-right-from-square"></i>
				</HTMLSimpleAnchor>
			</div>
		</footer>
	</article>
</template>

<style scoped>
.Tattoo {
	height: 100%;
	width: 100%;
}

img {
	width: 100%;
	border-radius: 10px;
}

.Tattoo__Footer {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.Tattoo__Footer--metadata {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	justify-content: space-between;
}

.Tattoo__metadata--left {
	display: flex;
	gap: 5px;
	align-items: center;
	flex-wrap: wrap;
}

.Tattoo__Footer--header {
	display: flex;
	gap: 10px;
	img {
		width: 45px;
		height: 45px;
		object-fit: cover;
		border-radius: 100%;
	}
	align-items: center;
}

.Tattoo__header--text {
	display: flex;
	flex-direction: column;
	& p {
		font-size: 0.9rem;
		margin-top: 4px;
		color: var(--color-second);
	}
}

.Tattoo__Footer--Goto {
	border-top: 1px solid var(--color-light);
	padding: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 5px;
}

.Tattoo__metadata--right {
	display: flex;
	align-items: center;
	gap: 5px;
}

i {
	font-size: 0.8rem;
}
</style>
