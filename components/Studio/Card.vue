<script lang="ts" setup>
import type { Studio } from '~/models/studio/studio.model'

defineProps<{
	studio: Studio
	toSubscribe?: string
}>()
</script>

<template>
	<NuxtLink
		:to="`/s/${studio.id}${toSubscribe ? `/billing?subscribe=${toSubscribe}` : ''}`"
		prefetch
		prefetch-on="visibility"
	>
		<article class="Studio">
			<header class="Studio__Header">
				<StudioBanner :banner="studio.banner?.key" />
			</header>
			<div class="Studio__Content">
				<div class="Studio__Content--Left">
					<ProfileAvatar size="xl" :avatar="studio.avatar?.key" />
					<div>
						<h3>{{ studio.name }}</h3>
						<span>@{{ studio.username }}</span>
					</div>
				</div>
				<p>{{ studio.description }}</p>
			</div>
		</article>
	</NuxtLink>
</template>

<style scoped lang="scss">
a {
	text-decoration: none;
	width: fit-content;
	max-width: 800px;
}

.Studio {
	width: 100%;
	display: flex;
	flex-direction: column;
	transition: all 0.4s ease;
	border-radius: 10px;
}

.Studio:hover {
	box-shadow: var(--box-shadow);
}

.Studio:hover .Studio__Content {
	border: 1px solid transparent;
}

.Studio__Header {
	width: 100%;
	height: 250px;
	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
}

.Studio__Content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
	border: 1px solid var(--color-light);
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	gap: 15px;
}

.Studio__Content--Left {
	width: 100%;
	display: grid;
	align-items: center;
	grid-template-columns: 1fr 1fr;
	gap: 10px;
	h3 {
		text-wrap: nowrap;
	}
}

p {
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 3;
	line-clamp: 3;
	-webkit-box-orient: vertical;
}
</style>
