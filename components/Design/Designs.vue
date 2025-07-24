<script lang="ts" setup>
import type { Design } from '~/models/design/design.model'

const { params, designs } = defineProps<{
	params: { username: string }
	designs: Array<Design>
}>()

const route = useRoute()

const nickname = route.params.nickname as string

const emit = defineEmits<{
	(e: 'update:designs', v: Array<Design>): void
}>()
const { t } = useI18n()

const modalDelete = ref(false)
const modalUpdate = ref(false)
const modalImg = ref(false)
const idDesign = ref(0)
const pending = ref(true)
const updateDesignValue = reactive({
	description: '',
	price: '0',
})

const selected = reactive({
	category: '',
	sortCreatedAt: 'DESC',
	sortPrice: '',
})

const categories = ref<Array<string> | null>([])

let element: HTMLElement | undefined

async function getDesigns(page: number) {
	try {
		pending.value = true
		const dataFetch = await useNuxtApp().$designService.getDesigns(
			params.username,
			{
				page,
				category: selected.category ?? '',
				sortCreatedAt: selected.sortCreatedAt ?? '',
				sortPrice: selected.sortPrice ?? '',
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
	categories.value = await useNuxtApp().$designService.getCategories(nickname)

	element = onScroll({
		countReturnedItems: dataFetch.perPage,
		total: dataFetch.total,
		fx: async (page) => await getDesigns(page),
	})
})

onBeforeUnmount(() => {
	if (element) removeOnScroll(element)
})

async function deleteDesign() {
	const success = await useNuxtApp().$designService.deleteDesign(
		idDesign.value,
	)
	if (success) {
		useToastsStore().addToast({
			message: t('design.successDelete'),
			type: 'success',
		})
		emit(
			'update:designs',
			designs.filter(({ id }) => id !== idDesign.value),
		)
	}
}

async function updateDesign() {
	const success = await useNuxtApp().$designService.updateDesign(
		idDesign.value,
		{
			description: updateDesignValue.description,
			price: Number(updateDesignValue.price),
		},
	)
	if (success) {
		useToastsStore().addToast({
			message: t('design.successUpdate'),
			type: 'success',
		})

		emit(
			'update:designs',
			designs.map((design) =>
				design.id === idDesign.value
					? {
							...design,
							description: updateDesignValue.description,
							price: Number(updateDesignValue.price),
						}
					: design,
			),
		)
	}
}

async function designsWithFilters(selecteds: typeof selected) {
	const designWithFilter = await useNuxtApp().$designService.getDesigns(
		nickname,
		{
			page: 0,
			category: selecteds.category ?? '',
			sortCreatedAt: selecteds.sortCreatedAt ?? '',
			sortPrice: selecteds.sortPrice ?? '',
		},
	)
	emit('update:designs', designWithFilter.designs)
}
</script>

<template>
	<DesignFilter
		:categories="categories ?? []"
		:initial-filters="selected"
		@update:filters="designsWithFilters"
	/>
	<div class="Designs">
		<template v-if="designs">
			<Design
				v-for="design in designs"
				:key="design.id"
				:design="design"
				@delete="
					(id) => {
						modalDelete = true
						idDesign = id
					}
				"
				@update="
					(id) => {
						modalUpdate = true
						idDesign = id
					}
				"
				@show-designs="
					(id) => {
						modalImg = true
						idDesign = id
					}
				"
			/>
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
				<HTMLButton
					type="button"
					:click="
						() => {
							deleteDesign()
							modalDelete = false
						}
					"
				>
					{{ $t('design.deleteDesign') }}
				</HTMLButton>
			</ModalButtons>
		</Modal>
		<Modal v-model:opened="modalUpdate">
			<template #title>
				<h2>Actualizar</h2>
			</template>
			<HTMLForm :action="updateDesign">
				<HTMLTextArea
					id="description"
					v-model:value="updateDesignValue.description"
					type="text"
					:validators="{ required: false, maxLength: 250 }"
					:label="$t('design.form.newDescription')"
				/>
				<HTMLInput
					id="price"
					v-model:value="updateDesignValue.price"
					type="number"
					:label="$t('design.form.newPrice')"
					:validators="{ required: false }"
				/>
				<HTMLButton
					type="submit"
					:click="
						() => {
							updateDesign()
							modalUpdate = false
						}
					"
				>
					{{ $t('design.updateDesign') }}
				</HTMLButton>
				<HTMLButton
					type="button"
					:without-background="true"
					:click="() => (modalUpdate = false)"
				>
					{{ $t('common.cancel') }}
				</HTMLButton>
			</HTMLForm>
		</Modal>
		<ImageModal v-model:opened="modalImg">
			<CarouselModal
				:images="
					designs.map((d) => ({
						id: d.id,
						src: d.image.key,
					}))
				"
				:selected-id="idDesign"
			/>
		</ImageModal>
	</div>
</template>

<style lang="scss" scoped>
.Filter {
	display: flex;
	gap: 16px;
	justify-content: start;
}
.Designs {
	display: grid;
	grid-template-columns: repeat(4, minmax(300px, 1fr));
	gap: 16px;
}

@media (max-width: 1400px) {
	.Designs {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (max-width: 900px) {
	.Designs {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 600px) {
	.Designs {
		grid-template-columns: 1fr;
	}
}
</style>
