<script setup>
import { richTextResolver } from '@storyblok/richtext'
import { FULL_LOGO_IMAGE_URL, SITE_URL } from '~/common/configs'

const { blok, slug } = defineProps({
	blok: Object,
	slug: String,
})

// SEO
const { t } = useI18n()

const seoMeta = buildSeoMeta({
	title: blok.title,
	description: blok.excerpt,
	ogImage: {
		url: blok.banner.filename,
	},
	ogImageAlt: blok.banner.alt,
	ogType: 'article',
	ogUrlPath: slug,
	article: {
		author: ['Alpaca Tattoo'],
		publishedAt: dateToISO8601(blok.published_at),
		tags: blok.categories.map((category) => t(`guides.tags.${category}`)),
		updatedAt: dateToISO8601(blok.last_updated),
	},
})

useSeoMeta(seoMeta)

useJsonld({
	'@context': 'https://schema.org',
	'@type': 'BlogPosting',
	mainEntityOfPage: {
		'@type': 'WebPage',
		'@id': seoMeta.ogUrl,
	},
	headline: seoMeta.title,
	description: seoMeta.description,
	image: seoMeta.ogImage,
	author: {
		'@type': 'Organization',
		name: 'Alpaca Tattoo',
		url: SITE_URL,
	},
	publisher: {
		'@type': 'Organization',
		name: 'Alpaca Tattoo',
		logo: {
			'@type': 'ImageObject',
			url: FULL_LOGO_IMAGE_URL,
		},
	},
	datePublished: formateDateInput(blok.published_at),
	dateModified: formateDateInput(blok.last_updated),
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
	table {
		border-collapse: collapse;
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

<style scoped lang="scss">
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
	padding: 10px;
}

h1 {
	text-align: center;
	font-size: 2.2rem;
	padding: 0 10px;
}

.Snippet {
	font-style: italic;
	&,
	text {
		padding: 10px;
	}
}
</style>
