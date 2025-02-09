<script setup lang="ts">
// Types
import type { Ref } from 'vue'
import {
	PhCaretDoubleRight,
	PhCaretRight,
	PhDotsThree,
	PhCaretDoubleLeft,
	PhCaretLeft,
} from '@phosphor-icons/vue'

type Navigate = {
	activate: boolean
	fn?: (n: number) => any
	max?: number
	disableMemo?: boolean
	selected?: number
}

const props = defineProps<{
	navigate: Navigate
	totalName?: string
	page?: number
}>()

const total = inject<Ref<number>>(props.totalName ?? 'total')
const search = useSearch()
// Paginate
if (!total)
	throw createError({
		message: 'Total no injected',
		statusCode: 500,
		fatal: true,
	})
const pages = ref(Math.ceil(total.value / (props.navigate?.max ?? 1)))
const selected = ref(props.navigate.selected ?? 0)

// Mount and watch
watch(selected, (selected) => {
	emits('update:page', selected)
})
watch(total, (newValue) => {
	pages.value = Math.ceil(newValue / (props.navigate?.max ?? 1))
})
watch(
	() => props.page,
	(page) => {
		if (page) setSelected(page)
	},
)
watch(search, () => {
	setSelected(0)
})
// Memo
const emits = defineEmits<{
	(e: 'update:page', page: number): void
}>()
// Set page selected
async function setSelected(toSet: number) {
	selected.value = toSet
	if (props.navigate.fn) props.navigate.fn(toSet)
}

function getIndex(index: number) {
	return pages.value > 5
		? selected.value + 4 > pages.value - 1
			? index + (pages.value - 5)
			: index + selected.value
		: index
}
</script>

<template>
	<nav class="Table__nav">
		<button :disabled="selected === 0" @click="() => setSelected(0)">
			<PhCaretLeft
				:color="
					selected === 0 ? 'var(--color-light)' : 'var(--color-main)'
				"
			/>
		</button>
		<button
			:disabled="selected === 0"
			@click="() => setSelected(selected - 1)"
		>
			<PhCaretDoubleLeft
				:color="
					selected === 0 ? 'var(--color-light)' : 'var(--color-main)'
				"
			/>
		</button>
		<button
			v-for="index in pages > 5 ? 5 : pages"
			:key="index"
			:class="getIndex(index) - 1 === selected ? 'Selected' : ''"
			@click="() => setSelected(getIndex(index) - 1)"
		>
			{{ getIndex(index) }}
		</button>
		<PhDotsThree v-if="selected + 5 < pages" color="var(--color-main)" />
		<button
			:disabled="pages === selected + 1 || pages === 0"
			@click="() => setSelected(selected + 1)"
		>
			<PhCaretRight
				height="22"
				:color="
					pages === selected + 1 || pages === 0
						? 'var(--color-light)'
						: 'var(--color-main)'
				"
			/>
		</button>
		<button
			:disabled="pages === selected + 1 || pages === 0"
			@click="() => setSelected(pages - 1)"
		>
			<PhCaretDoubleRight
				:color="
					pages === selected + 1 || pages === 0
						? 'var(--color-light)'
						: 'var(--color-main)'
				"
			/>
		</button>
	</nav>
</template>

<style scoped>
.Table__nav {
	margin-top: 10px;
	display: flex;
	gap: 5px;
	justify-content: center;
	align-items: flex-end;
	flex-wrap: wrap;
}

.Selected {
	background-color: var(--color-main) !important;
	color: white !important;
}

.Table__nav button {
	background-color: transparent;
	border: none;
	width: 25px;
	height: 25px;
	color: var(--color-main);
	display: flex;
	justify-content: center;
	align-items: center;
}

button:disabled,
button:disabled i {
	color: var(--color-light) !important;
}

i {
	color: var(--color-main);
}
</style>
