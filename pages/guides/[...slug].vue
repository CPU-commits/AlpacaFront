<script lang="ts" setup>
const slug = useRoute().params.slug

const { story } = await useAsyncStoryblok(`guides/${slug}`, {
	lazy: false,
	api: {
		version: 'draft',
	},
	bridge: {},
})
</script>

<template>
	<div class="Container">
		<div class="Content">
			<StoryblokComponent
				v-if="story"
				:blok="story.content"
				:slug="`/guides/${slug}`"
			/>
		</div>
	</div>
</template>

<style scoped>
.Container {
	display: flex;
	flex-direction: column;
	gap: 10px;
	justify-content: center;
}

.Content {
	max-width: 800px;
}
</style>
