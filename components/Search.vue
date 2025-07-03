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
// Selected
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
		<header class="Publisher__types">
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
				<i class="fa-solid fa-paper-plane"></i>
				<small>{{ $t('search.publications') }}</small>
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
	</div>
</template>

<style lang="scss" scoped>
.Search {
	width: 100%;
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
