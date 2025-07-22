<script lang="ts" setup>
const isLikeidTattoo = useRoute().query.isLikeidTattoo
const oldPage = ref(0)
const page = ref(0)
const selected = ref(0)
const q = ref((useRoute().query.q as string) ?? '*')

const kind = computed(
	() => (useRoute().query.kind ?? 'pub') as 'tattoo' | 'pub',
)
// Scroll
let element: HTMLElement | undefined

const { data, status: statusPosts } = useAsyncData(
	async (app) => {
		const equalQ = q.value === ((useRoute().query.q as string) ?? '*')
		if (!equalQ) {
			publications.value = undefined
			if (element) removeOnScroll(element)
			q.value = (useRoute().query.q as string) ?? '*'
		}
		const equalPage = page.value === oldPage.value
		oldPage.value = page.value

		return await Promise.all([
			app?.$postService.search({
				q: q.value,
				page: page.value,
			}),
			equalPage
				? app?.$profileService.search({
						q: q.value,
					})
				: undefined,
			equalPage
				? app?.$studioService.search({
						q: q.value,
					})
				: undefined,
		])
	},
	{
		watch: [page, useRoute()],
		server: false,
		immediate: kind.value === 'pub',
	},
)
const profiles = computed(() => data.value?.[1])
const studios = computed(() => data.value?.[2])
const dataPosts = computed(() => data.value?.[0])

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
const tattoos = ref(dataTattoos.value?.tattoos)
const publications = ref(dataPosts.value?.publications)

watch(dataPosts, (posts) => {
	if (posts?.publications) {
		if (!publications.value) {
			element = onScroll({
				countReturnedItems: posts?.perPage ?? 1,
				total: posts?.total ?? 0,
				fx: async (n) => {
					page.value = n
				},
			})
			publications.value = []
		}

		publications.value?.push(...posts.publications)
	}
})
watch(dataTattoos, (t) => {
	if (t?.tattoos) {
		if (!tattoos.value) {
			element = onScroll({
				countReturnedItems: t?.perPage ?? 1,
				total: t?.total ?? 0,
				fx: async (n) => {
					page.value = n
				},
			})
			publications.value = []
		}

		tattoos.value?.push(...t.tattoos)
	}
})

onBeforeUnmount(() => {
	if (element) removeOnScroll(element)
})
</script>

<template>
	<section class="Publications">
		<Search v-model:selected="selected" />
		<template v-if="selected === 0">
			<HTMLHorizontalItems v-if="profiles && profiles.length > 0">
				<ProfileCard
					v-for="profile in profiles"
					:key="profile.id"
					:profile="profile"
				/>
			</HTMLHorizontalItems>
			<HTMLHorizontalItems v-if="studios && studios.length > 0">
				<StudioCard
					v-for="studio in studios"
					:key="studio.id"
					:studio="studio"
				/>
			</HTMLHorizontalItems>

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
			<Empty
				v-else-if="!publications && statusPosts === 'success'"
				:text="$t('profile.noPublications')"
			/>
			<template v-if="statusPosts === 'pending'">
				<PublicationSkeleton v-for="i in 3" :key="i" />
			</template>
		</template>
		<template v-else-if="selected === 1">
			<section
				v-if="tattoos && statusTattoos === 'success'"
				class="Tattoos__posts"
			>
				<Gallery :tattoos="tattoos" />
			</section>
			<Empty
				v-else-if="statusTattoos !== 'pending' && !tattoos"
				:text="$t('profile.noTattoos')"
			/>
			<div v-if="statusTattoos === 'pending'" class="Tattoos_skeleton">
				<TattooSkeleton v-for="i in 3" :key="i" />
			</div>
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

.Profile__posts {
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.Tattoos_skeleton {
	display: flex;
	width: 100%;
	gap: 15px;
	padding: 10px;
}
</style>
