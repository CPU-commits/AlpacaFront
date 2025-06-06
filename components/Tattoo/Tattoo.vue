<script lang="ts" setup>
import type { Tattoo } from '~/models/tattoo/tattoo.model'

const props = defineProps<{
	tattoo: Tattoo
}>()

const parsedContent = computed(() =>
	props.tattoo.description?.replaceAll(/#(\w+)/g, (_, hashtag) => {
		return `<a href="/hashtag/${hashtag}" class="hashtag">#${hashtag}</a>`
	}),
)
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
				<span
					><i class="fa-solid fa-chart-simple"></i>
					{{ tattoo.views }}</span
				>
				<span
					><i class="fa-solid fa-heart"></i> {{ tattoo.likes }}</span
				>
				<span>{{ timeAgo(tattoo.createdAt) }}</span>

				<Categories
					v-if="tattoo.categories"
					:categories="tattoo.categories"
				/>
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
</style>
