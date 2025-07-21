<script lang="ts" setup>
import type { Design } from '~/models/tattoo/design.model'

const { params, designs } = defineProps<{
	params: { username: string }
	designs: Array<Design>
}>()

const emit = defineEmits<{
	(e: 'update:designs', v: Array<Design>): void
}>()
// const { t } = useI18n()

const pending = ref(true)
let element: HTMLElement | undefined

async function getDesigns(page: number) {
	try {
		pending.value = true
		const dataFetch = await useNuxtApp().$designService.getDesigns(
			params.username,
			{
				page,
			},
		)
		emit('update:designs', [...designs, ...dataFetch.designs])
		return dataFetch
	} finally {
		pending.value = false
	}
}
onMounted(async () => {
	const dataFetch = await getDesigns(0)

	element = onScroll({
		countReturnedItems: dataFetch.perPage,
		total: dataFetch.total,
		fx: async (page) => await getDesigns(page),
	})
})
onBeforeUnmount(() => {
	if (element) removeOnScroll(element)
})
</script>

<template>
	<div class="Designs">
		<template v-if="designs">
			<Design
				v-for="design in designs"
				:key="design.id"
				:design="design"
			/>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.Designs {
	display: grid;
	grid-template-columns: repeat(4, minmax(350px, 1fr));
	gap: 16px;
}
</style>
