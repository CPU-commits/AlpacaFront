<script lang="ts" setup>
const isLikeidTattoo = useRoute().query.isLikeidTattoo
const page = ref(0)
const selected = ref(0)

const kind = computed(
	() => (useRoute().query.kind ?? 'pub') as 'tattoo' | 'pub',
)
const { data: dataPosts, status: statusPosts } = useAsyncData(
	async (app) => {
		return await app?.$postService.search({
			q: (useRoute().query.q as string) ?? '*',
			page: page.value,
		})
	},
	{
		watch: [page, useRoute()],
		server: false,
		immediate: kind.value === 'pub',
	},
)
const { data: dataTattoos, status: statusTattoos } = useAsyncData(
	async (app) => {
		if (!useSearchTattoo().value && !isLikeidTattoo) return null

		return await app?.$tattooService.searchSimilarity(
			{
				page: page.value,
				isLikeidTattoo: isLikeidTattoo
					? parseInt(isLikeidTattoo as string)
					: undefined,
			},
			useSearchTattoo().value,
		)
	},
	{
		watch: [page, useRoute(), useSearchTattoo()],
		server: false,
		immediate: kind.value === 'tattoo',
	},
)
const tattoos = computed(() => dataTattoos.value?.tattoos)
const publications = computed(() => dataPosts.value?.publications)
</script>

<template>
	<section class="Publications">
		<Search v-model:selected="selected" />

		<template v-if="selected === 0">
			<section
				v-if="publications && statusPosts === 'success'"
				class="Profile__posts"
			>
				<Publication
					v-for="post in publications"
					:key="post.id"
					:post="post"
				/>
			</section>
			<template v-else-if="statusPosts === 'pending'">
				<PublicationSkeleton v-for="i in 3" :key="i" />
			</template>
			<Empty v-else :text="$t('profile.noPublications')" />
		</template>
		<template v-else-if="selected === 1">
			<section
				v-if="tattoos && statusTattoos === 'success'"
				class="Tattoos__posts"
			>
				<Gallery :tattoos="tattoos" />
			</section>
			<div
				v-else-if="statusTattoos === 'pending'"
				class="Tattoos_skeleton"
			>
				<TattooSkeleton v-for="i in 3" :key="i" />
			</div>
			<Empty v-else :text="$t('profile.noTattoos')" />
		</template>
	</section>
</template>

<style scoped>
.Publications {
	display: flex;
	flex-direction: column;
	gap: 20px;
	width: 100%;
	max-width: 1000px;
	padding: 20px;
}

.Tattoos_skeleton {
	display: flex;
	width: 100%;
	gap: 15px;
	padding: 10px;
}
</style>
