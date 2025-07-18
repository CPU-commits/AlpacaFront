<script lang="ts" setup>
import type { Publication } from '~/models/publication/publication.model'

const { params, publications } = defineProps<{
	params: { username?: string; idStudio?: number }
	publications: Array<Publication>
}>()

const emit = defineEmits<{
	(e: 'update:publications', v: Array<Publication>): void
}>()
// i18n
const { t } = useI18n()
// Form
const modalDelete = ref(false)
const idPublication = ref(0)
// Scroll
const pending = ref(true)
let element: HTMLElement | undefined

async function getPosts(page: number) {
	try {
		pending.value = true
		const dataFetch = await useNuxtApp().$postService.getPublications(
			params,
			{
				page,
			},
		)
		emit('update:publications', [
			...publications,
			...dataFetch.publications,
		])
		return dataFetch
	} finally {
		pending.value = false
	}
}

onMounted(async () => {
	// Set onscroll
	const dataFetch = await getPosts(0)

	element = onScroll({
		countReturnedItems: dataFetch.perPage,
		total: dataFetch.total,
		fx: async (page) => await getPosts(page),
	})
})

onBeforeUnmount(() => {
	if (element) removeOnScroll(element)
})

async function deletePublication() {
	const success = await useNuxtApp().$postService.deletePublication(
		idPublication.value,
	)
	if (success) {
		useToastsStore().addToast({
			message: t('publication.successDelete'),
			type: 'success',
		})
		emit(
			'update:publications',
			publications.filter(({ id }) => id !== idPublication.value),
		)
		modalDelete.value = false
	}
}
</script>

<template>
	<div class="Posts">
		<template v-if="publications">
			<Publication
				v-for="post in publications"
				:key="post.id"
				:post="post"
				@delete="
					(id) => {
						modalDelete = true
						idPublication = id
					}
				"
			/>
		</template>
		<p v-else>{{ $t('profile.noPublications') }}</p>
		<template v-if="pending">
			<PublicationSkeleton v-for="i in 3" :key="i" />
		</template>

		<Modal v-model:opened="modalDelete">
			<template #title>
				<h2>Eliminar</h2>
			</template>
			<ModalButtons>
				<HTMLButton
					type="button"
					:without-background="true"
					:click="() => (modalDelete = false)"
				>
					{{ $t('common.cancel') }}
				</HTMLButton>
				<HTMLButton type="button" :click="deletePublication">
					{{ $t('publication.deletePublication') }}
				</HTMLButton>
			</ModalButtons>
		</Modal>
	</div>
</template>

<style scoped>
.Posts {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	gap: 2rem;
	position: relative;
	padding: 1rem;
}
</style>
