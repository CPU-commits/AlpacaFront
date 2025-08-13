<script lang="ts" setup>
const idPublication = parseInt(useRoute().params.idPublication as string)

// SEO
const { t } = useI18n()

const { data, status, error } = useAsyncData(async (app) => {
	return await app?.$postService.getPublication(idPublication)
})
const firstTattooOrImage = computed(
	() =>
		data.value?.tattoos?.at(0)?.image.key ?? data.value?.images?.at(0)?.key,
)

const seoMeta = buildSeoMeta({
	title: t('publication.metadata.title', {
		description: preview(data.value?.content ?? ''),
		name: data.value?.profile.user.username,
	}),
	description: t('login.metadata.description'),
	ogType: 'website',
	ogUrlPath: `/p/${idPublication}`,
	ogImage: {
		key: firstTattooOrImage.value,
	},
	ogImageAlt: firstTattooOrImage.value
		? t('publication.metadata.alt')
		: undefined,
})

useSeoMeta(seoMeta)
</script>

<template>
	<ErrorWrapper :errors="[error]" throw-err>
		<section class="P">
			<Publication v-if="data" :post="data" />
			<PublicationSkeleton v-if="status === 'pending'" />
		</section>
	</ErrorWrapper>
</template>

<style scoped>
.P {
	width: 100%;
	padding: 10px;
}
</style>
