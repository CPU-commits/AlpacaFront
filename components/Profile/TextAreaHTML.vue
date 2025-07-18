<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import type { Node } from '@tiptap/pm/model'

const props = defineProps<{
	readOnly: boolean
	clean?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:value', value: string): void
}>()

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
	const regex = /#\w+/g

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
			placeholder: t('profile.publisher.what'),
		}),
		HashtagHighlight,
	],
	onUpdate: () => {
		emit('update:value', editor.value?.getText() ?? '')
	},
	editable: !props.readOnly,
})

watch(
	() => props.clean,
	(clean) => {
		if (clean && editor.value) {
			editor.value.commands.setContent('')
		}
	},
)

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
	<EditorContent :editor="editor" class="PublicationTextArea" />
</template>

<style lang="scss">
.hashtag {
	color: var(--color-main);
	font-weight: bold;
}

.PublicationTextArea .tiptap {
	border: 1px solid var(--color-light);
	padding: 10px;
	min-height: 80px;
	transition: all 0.4s ease-in-out;
	border-radius: 8px;
}

.PublicationTextArea .tiptap p.is-editor-empty:first-child::before {
	color: #879ac1;
	content: attr(data-placeholder);
	float: left;
	height: 0;
	pointer-events: none;
}

.PublicationTextArea .tiptap p {
	font-size: 0.9rem;
}

.PublicationTextArea .tiptap:focus {
	outline: none;
	border: 1px var(--color-second) solid;
}
</style>
