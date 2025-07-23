<script setup lang="ts">
const props = defineProps<{
	categories: Array<string>
	initialFilters?: {
		category?: string
		sortCreatedAt?: string
		sortPrice?: string
	}
}>()

const emits = defineEmits<{
	(
		e: 'update:filters',
		filters: {
			category: string
			sortCreatedAt: string
			sortPrice: string
		},
	): void
}>()

const category = ref(props.initialFilters?.category ?? '')
const sortCreatedAt = ref(props.initialFilters?.sortCreatedAt ?? 'DESC')
const sortPrice = ref(props.initialFilters?.sortPrice ?? '')

watch([category, sortCreatedAt, sortPrice], () => {
	emits('update:filters', {
		category: category.value,
		sortCreatedAt: sortCreatedAt.value,
		sortPrice: sortPrice.value,
	})
})
</script>

<template>
	<div class="design-filter">
		<HTMLSelect
			id="category-select"
			v-model:value="category"
			label="Categoría"
			:disabled="!categories?.length"
			:validators="{ required: false }"
		>
			<option value="">Todas</option>
			<option v-for="cat in categories" :key="cat" :value="cat">
				{{ cat }}
			</option>
		</HTMLSelect>

		<HTMLSelect
			id="sort-created-at"
			v-model:value="sortCreatedAt"
			label="Ordenar por fecha"
			:validators="{ required: true }"
		>
			<option value="DESC">Más reciente</option>
			<option value="ASC">Más antiguo</option>
		</HTMLSelect>

		<HTMLSelect
			id="sort-price"
			v-model:value="sortPrice"
			label="Ordenar por precio"
			:validators="{ required: false }"
		>
			<option value="">Sin ordenar</option>
			<option value="ASC">Menor precio</option>
			<option value="DESC">Mayor precio</option>
		</HTMLSelect>
	</div>
</template>

<style scoped>
.design-filter {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	align-items: center;
}

label {
	font-weight: 600;
	margin-right: 0.5rem;
}
</style>
