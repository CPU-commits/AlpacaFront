<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import type { Node } from '@tiptap/pm/model'

const props = defineProps<{
	clean?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:value', value: string): void
	(e: 'update:selected', v: number): void
}>()
// Modal
const modalFilters = ref(false)
// Filters
const queryAreas = useRoute().query.areas
const queryColor = useRoute().query.color
const parsedQueryAreas =
	typeof queryAreas === 'string' ? [queryAreas] : queryAreas
const areas = [
	'arm',
	'leg',
	'back',
	'chest',
	'abdomen',
	'neck',
	'head',
	'hand',
	'foot',
	'hip',
	'other',
]
const filters = reactive({
	areas: parsedQueryAreas ?? ([] as Array<string>),
	color: typeof queryColor === 'string' ? queryColor : '',
})
const selectedFilters = computed(() =>
	[
		...filters.areas.map((area) => ({
			type: 'tattoo',
			text: t(`common.areas.${area}`),
			key: area,
		})),
		filters.color !== ''
			? {
					type: 'color',
					text: t(`common.colors.${filters.color}`),
					key: filters.color,
				}
			: undefined,
	].filter((v) => v !== undefined),
)
// Tattoo
const keyImage = ref<string | null>(null)
const selected = ref(
	!useRoute().query.kind ? 0 : useRoute().query.kind === 'pub' ? 0 : 1,
)
emit('update:selected', selected.value)
const tags = ref<Array<string>>([])
const value = ref(useRoute().query.q ?? '')

const HashtagHighlight = Extension.create({
	name: 'hashtagHighlight',
	addProseMirrorPlugins() {
		return [
			new Plugin({
				key: new PluginKey('hashtagHighlight'),
				state: {
					init(_, { doc }) {
						return DecorationSet.create(
							doc,
							findHashtagDecorations(doc),
						)
					},
					apply(transaction, oldDecorationSet) {
						if (transaction.docChanged) {
							return DecorationSet.create(
								transaction.doc,
								findHashtagDecorations(transaction.doc),
							)
						}
						return oldDecorationSet
					},
				},
				props: {
					decorations(state) {
						return this.getState(state)
					},
				},
			}),
		]
	},
})

function findHashtagDecorations(doc: Node) {
	const decorations: Array<Decoration> = []
	const regex = /#[\w-]+/g

	doc.descendants((node, pos) => {
		if (!node.isText) return

		let match
		while ((match = regex.exec(node.text as string)) !== null) {
			const start = pos + match.index
			const end = start + match[0].length
			decorations.push(
				Decoration.inline(start, end, {
					class: 'hashtag',
				}),
			)
		}
	})

	return decorations
}

const { t } = useI18n()

const editor = useEditor({
	content: value.value,
	extensions: [
		StarterKit.configure({
			bold: false,
			listItem: false,
			bulletList: false,
			orderedList: false,
			code: false,
			codeBlock: false,
			heading: false,
			strike: false,
			blockquote: false,
			hardBreak: false,
			horizontalRule: false,
			italic: false,
			dropcursor: false,
		}),
		Placeholder.configure({
			placeholder: t('search.tattoo'),
		}),
		HashtagHighlight,
	],
	onUpdate: () => {
		const foundedTags = editor.value?.getText().match(/#[\w-]+/g)
		tags.value = foundedTags ? foundedTags.map((tag) => tag.slice(1)) : []

		emit('update:value', editor.value?.getText() ?? '')
		value.value = editor.value?.getText() ?? ''
	},
})

watch(
	() => props.clean,
	(clean) => {
		if (clean && editor.value) {
			editor.value.commands.setContent('')
		}
	},
)

async function searchIsLikeTattooKey(isLikeidTattoo: number) {
	const key = await useNuxtApp().$tattooService.getKeyTattoo(isLikeidTattoo)
	keyImage.value = key.key
}

watch(
	() => useRoute().query.isLikeidTattoo,
	(isLikeidTattoo) => {
		searchIsLikeTattooKey(parseInt(isLikeidTattoo as string))
	},
)

onMounted(async () => {
	const isLikeidTattoo = useRoute().query.isLikeidTattoo
	if (isLikeidTattoo) {
		searchIsLikeTattooKey(parseInt(isLikeidTattoo as string))
	}
})

onBeforeUnmount(() => editor.value?.destroy())

async function search() {
	await useRouter().push({
		path: '/search',
		query: {
			q: value.value,
			tags: tags.value,
			kind: 'pub',
			areas: filters.areas,
			color: filters.color,
		},
	})
}

async function searchTattoos(image: File) {
	useSearchTattoo().value = image
	keyImage.value = null

	await useRouter().push({
		path: '/search',
		query: {
			kind: 'tattoo',
		},
	})
}
</script>

<template>
	<div class="Search">
		<header class="Publisher__header">
			<div class="Publisher__types">
				<button
					class="Publisher__types--type"
					:class="{ Selected: selected === 0 }"
					@click="
						() => {
							selected = 0
							$emit('update:selected', 0)
						}
					"
				>
					<i class="fa-solid fa-magnifying-glass"></i>
					<small>{{ $t('search.search') }}</small>
				</button>
				<button
					class="Publisher__types--type"
					:class="{ Selected: selected === 1 }"
					@click="
						() => {
							selected = 1
							$emit('update:selected', 1)
						}
					"
				>
					<i class="fa-solid fa-expand"></i>
					<small>{{ $t('search.tattoos') }}</small>
				</button>
			</div>
		</header>

		<template v-if="selected === 0">
			<div class="Search__editor">
				<EditorContent :editor="editor" class="Editor" />
				<button class="ButtonSearch" @click="search">
					<i class="fa-solid fa-magnifying-glass"></i>
				</button>
			</div>

			<div v-if="tags.length > 0" class="Tags">
				<Categories :categories="tags" />
			</div>
		</template>
		<template v-else-if="selected === 1">
			<div class="Search__images">
				<HTMLInputImages
					id="images"
					:image="{
						image: useSearchTattoo().value,
						source: keyImage ?? undefined,
						provider: 'cloudinary',
					}"
					:button="{
						icon: 'image',
						text: $t('search.selectTattoo'),
					}"
					replace-image
					@update:images="
						(images) => {
							if (images && images.length > 0)
								searchTattoos(images[0])
							else useSearchTattoo().value = null
						}
					"
				/>
			</div>
		</template>
		<div v-if="selected === 0" class="Filters">
			<HTMLButton
				class="ButtonFilter"
				type="button"
				:click="() => (modalFilters = true)"
			>
				<i class="fa-solid fa-filter"></i>
				{{ $t('search.filters') }}
			</HTMLButton>
			<div
				v-for="filter in selectedFilters"
				:key="filter.text"
				class="Filters__Selected"
			>
				{{ filter.text }}
				<HTMLSimpleButton
					type="button"
					:click="
						() => {
							if (filter.type === 'tattoo')
								filters.areas = filters.areas.filter(
									(v) => v !== filter.key,
								)
							else filters.color = ''
						}
					"
				>
					<i class="fa-solid fa-xmark"></i>
				</HTMLSimpleButton>
			</div>
		</div>

		<BottomModal v-model:opened="modalFilters">
			<template #title>
				<h2>{{ $t('search.filters') }}</h2>
			</template>
			<section class="FiltersSection">
				<h4>{{ $t('search.areas') }}</h4>
				<div class="FiltersSection--Options">
					<HTMLCheckbox
						v-for="area in areas"
						:id="area"
						:key="area"
						:value="area"
						:label="$t(`common.areas.${area}`)"
						:selected="filters.areas.includes(area)"
						@update:selected="
							(selected) => {
								if (selected) filters.areas.push(area)
								else
									filters.areas = filters.areas.filter(
										(v) => v !== area,
									)
							}
						"
					/>
				</div>
			</section>
			<br />
			<section class="FiltersSection">
				<h4>{{ $t('search.color') }}</h4>
				<div class="FiltersSection--Options">
					<HTMLCheckbox
						id="black"
						value="black"
						:label="$t('common.colors.black')"
						:selected="filters.color.includes('black')"
						@update:selected="
							(selected) => {
								if (selected) filters.color = 'black'
								else filters.color = ''
							}
						"
					/>
					<HTMLCheckbox
						id="fullColor"
						value="fullColor"
						:label="$t('common.colors.fullColor')"
						:selected="filters.color.includes('fullColor')"
						@update:selected="
							(selected) => {
								if (selected) filters.color = 'fullColor'
								else filters.color = ''
							}
						"
					/>
				</div>
			</section>
		</BottomModal>
	</div>
</template>

<style lang="scss" scoped>
.Search {
	width: 100%;
}

.Publisher__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.Filters {
	margin-top: 5px;
	display: flex;
	align-items: center;
	gap: 10px;
}

.Filters__Selected {
	background-color: var(--color-bg-light);
	padding: 0 8px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	gap: 5px;
	i {
		font-size: 0.8rem;
		height: 8px;
	}
}

.ButtonFilter {
	width: fit-content;
	padding: 0 10px;
}

.FiltersSection {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.FiltersSection--Options {
	display: flex;
	gap: 10px;
	align-items: center;
	flex-wrap: wrap;
}

.Publisher__types {
	display: flex;
	gap: 10px;
}

.Publisher__types--type {
	padding: 5px 8px;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
	border: none;
	background-color: transparent;
	small,
	i {
		font-size: 0.8rem;
	}
}

.Selected {
	background-color: var(--color-main);
	small,
	i {
		color: var(--color-with-main);
	}
}

.Search__editor {
	display: flex;
	width: 100%;
}

.Editor {
	width: 100%;
}

.ButtonSearch {
	background-color: var(--color-main);
	border: none;
	width: 40px;
	border-top-right-radius: 8px;
	border-bottom-right-radius: 8px;
	i {
		color: white;
	}
}

.Tags {
	display: flex;
	gap: 10px;
	padding-top: 10px;
}

.Search__images {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>

<style lang="scss">
.hashtag {
	color: var(--color-main);
	font-weight: bold;
}

.Search .tiptap {
	border: 1px solid var(--color-light);
	padding: 10px;
	transition: all 0.4s ease-in-out;
	border-bottom-left-radius: 8px;
	width: 100%;
}

.Search .tiptap p.is-editor-empty:first-child::before {
	color: #879ac1;
	content: attr(data-placeholder);
	float: left;
	height: 0;
	pointer-events: none;
}

.Search .tiptap p {
	font-size: 0.9rem;
}

.Search .tiptap:hover {
	box-shadow: var(--box-shadow);
	border: 1px solid transparent;
}

.Search .tiptap:focus {
	outline: none;
	box-shadow: var(--box-shadow);
	border: 1px solid transparent;
}
</style>
