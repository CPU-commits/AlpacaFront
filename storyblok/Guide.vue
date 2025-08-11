<script setup>
import { richTextResolver } from '@storyblok/richtext'

const { blok } = defineProps({
	blok: Object,
})

const { render } = richTextResolver()
const html = render(blok.content)
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
	<main class="Guide">
		<header>
			<img :src="blok.banner.filename" :alt="blok.banner.alt" />
			<h1>{{ blok.title }}</h1>
			<div class="Metadata">
				<span
					>{{ $t('guides.lastUpdate') }}:
					{{ formatDateLL(blok.last_updated) }}</span
				>
				<Categories
					v-if="blok.categories"
					:categories="
						blok.categories.map((category) =>
							$t(`guides.tags.${category}`),
						)
					"
				/>
			</div>
			<span class="Snippet">
				{{ blok.excerpt }}
			</span>
		</header>

		<div class="Text" v-html="html" />
		<StoryblokComponent
			v-for="currentBlok in blok.body"
			:key="currentBlok._uid"
			:blok="currentBlok"
		/>
	</main>
</template>

<style lang="scss">
.Guide .Text {
	padding: 30px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	h3 {
		font-size: 1.5rem;
	}
	ul {
		padding: 0px 18px;
	}
	blockquote {
		border-left: 3px solid var(--color-light);
		font-style: italic;
		padding: 5px;
	}
	tr {
		&:hover {
			background-color: var(--color-table-td-hover);
		}
	}
	td {
		border-bottom: 1px var(--color-light) solid;
		text-align: center;
		padding: 10px;
	}
	img {
		width: 100%;
		max-height: 250px;
		object-fit: contain;
	}
}
</style>

<style scoped>
img {
	width: 100%;
	max-height: 350px;
	object-fit: cover;
}

.Metadata {
	display: flex;
	gap: 10px;
	align-items: center;
	padding-top: 20px;
}

h1 {
	text-align: center;
	font-size: 2.2rem;
}

.Snippet {
	font-style: italic;
}
</style>
