<script setup lang="ts">
import dayjs from 'dayjs'
import type { Publication } from '~/models/publication/publication.model'

const { params } = defineProps<{
	label: string
	params: { username?: string; idStudio?: number }
}>()

const publications = ref<Array<Publication>>([])

const emit = defineEmits<{
	(e: 'update:publication', v: Publication | null): void
}>()
// Values
const isOpen = ref(false)
const selectedPublication = ref<null | Publication>(null)
const searchQuery = ref('')
// Data
const filters = reactive({
	from: '',
	to: '',
})
let timeout: NodeJS.Timeout

async function getPosts(q?: string) {
	const dataFetch = await useNuxtApp().$postService.getPublications(
		{
			...params,
		},
		{
			q,
			from:
				filters.from !== ''
					? dayjs(filters.from).startOf('D').toISOString()
					: '',
			to:
				filters.to !== ''
					? dayjs(filters.to).endOf('D').toISOString()
					: '',
		},
	)

	publications.value = dataFetch.publications ?? []
}

watch(filters, () => {
	getPosts(searchQuery.value)
})
watch(searchQuery, (q) => {
	if (timeout) clearTimeout(timeout)

	timeout = setTimeout(() => {
		getPosts(q)
	}, 400)
})
// Métodos
const toggleDropdown = () => {
	isOpen.value = !isOpen.value
	if (isOpen.value) {
		searchQuery.value = ''
	}
}

const closeDropdown = () => {
	isOpen.value = false
	searchQuery.value = ''
}

const selectPublication = (publication: Publication) => {
	selectedPublication.value = publication
	closeDropdown()
	emit('update:publication', publication)
}

const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && isOpen.value) {
		closeDropdown()
	}
}

onMounted(() => {
	document.addEventListener('keydown', handleKeydown)
	getPosts()
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
	<div class="form-group">
		<label class="form-label">{{ label }}</label>

		<!-- Select Trigger -->
		<div class="select-wrapper">
			<button
				type="button"
				class="select-trigger"
				:class="{ 'select-trigger--open': isOpen }"
				@click="toggleDropdown"
			>
				<div v-if="!selectedPublication" class="publication-display">
					<div class="publication-info">
						<span>{{ $t('common.selectPublication') }}</span>
					</div>
				</div>
				<div v-else class="publication-display">
					<div class="publication-info">
						<span class="publication-name">{{
							selectedPublication.content
						}}</span>
						<span class="publication-email">{{
							formatDateLL(selectedPublication.createdAt)
						}}</span>
					</div>
				</div>
				<svg
					class="chevron-icon"
					:class="{ 'chevron-icon--rotated': isOpen }"
					viewBox="0 0 24 24"
				>
					<path d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
				</svg>
			</button>

			<!-- Dropdown -->
			<div v-if="isOpen" class="dropdown">
				<!-- Search Input -->
				<div class="search-container">
					<div class="search-wrapper">
						<svg class="search-icon" viewBox="0 0 24 24">
							<path
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
						<input
							v-model="searchQuery"
							type="text"
							:placeholder="$t('common.searchPost')"
							class="search-input"
						/>
					</div>
					<HTMLInput
						v-model:value="filters.from"
						type="date"
						:label="$t('common.pubMinDate')"
					/>
					<HTMLInput
						v-model:value="filters.to"
						type="date"
						:label="$t('common.pubMaxDate')"
					/>
				</div>

				<!-- Publication List -->
				<div class="publication-list">
					<div v-if="publications.length === 0" class="no-results">
						{{ $t('common.noPublications') }}
					</div>
					<button
						v-for="publication in publications"
						:key="publication.id"
						type="button"
						class="publication-item"
						:class="{
							'publication-item--selected':
								selectedPublication?.id === publication.id,
						}"
						@click="selectPublication(publication)"
					>
						<div class="publication-info">
							<span class="publication-name">{{
								publication.content
							}}</span>
							<span class="publication-email">{{
								formatDateLL(publication.createdAt)
							}}</span>
						</div>
						<svg
							v-if="selectedPublication?.id === publication.id"
							class="check-icon"
							viewBox="0 0 24 24"
						>
							<path d="M5 13l4 4L19 7"></path>
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- Overlay -->
		<div v-if="isOpen" class="overlay" @click="closeDropdown"></div>
	</div>
</template>

<style scoped>
.form-group {
	margin-bottom: 0.5rem;
}

.form-label {
	display: block;
	margin-bottom: 0.5rem;
}

/* Select wrapper */
.select-wrapper {
	position: relative;
}

.select-trigger {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0.75rem;
	border: 1px solid var(--color-light);
	border-radius: 8px;
	background: white;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 1rem;
}

.select-trigger:hover {
	background: #f9fafb;
	border-color: #9ca3af;
}

.select-trigger:focus {
	outline: none;
	border-color: var(--color-second);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-trigger--open {
	border-color: var(--color-second);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Usuario display */
.publication-display {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.publication-info {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.publication-name {
	font-weight: 500;
	color: var(--color-second);
	font-size: 0.875rem;
}

.publication-email {
	font-size: 0.75rem;
	color: #6b7280;
}

/* Avatar */
.avatar-container {
	position: relative;
}

.avatar-container--large {
	width: 2.5rem;
	height: 2.5rem;
}

.avatar {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
}

.avatar--large {
	width: 100%;
	height: 100%;
}

.avatar-fallback {
	width: 100%;
	height: 100%;
	background: var(--color-second);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 0.75rem;
	font-weight: 500;
}

.avatar-fallback--large {
	font-size: 0.875rem;
}

/* Chevron icon */
.chevron-icon {
	width: 1rem;
	height: 1rem;
	color: #9ca3af;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
	transition: transform 0.2s ease;
}

.chevron-icon--rotated {
	transform: rotate(180deg);
}

/* Dropdown */
.dropdown {
	position: absolute;
	z-index: 10;
	width: 100%;
	margin-top: 0.25rem;
	background: white;
	border: 1px solid var(--color-light);
	border-radius: 8px;
	box-shadow:
		0 10px 15px -3px rgba(0, 0, 0, 0.1),
		0 4px 6px -2px rgba(0, 0, 0, 0.05);
	animation: dropdownSlide 0.2s ease-out;
}

@keyframes dropdownSlide {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Search */
.search-container {
	padding: 0.5rem;
	border-bottom: 1px solid #e5e7eb;
	display: flex;
	align-items: flex-end;
	gap: 10px;
	width: 100%;
}

.search-wrapper {
	position: relative;
	width: 100%;
}

.search-icon {
	position: absolute;
	left: 0.75rem;
	top: 50%;
	transform: translateY(-50%);
	width: 1rem;
	height: 1rem;
	color: #9ca3af;
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
}

.search-input {
	width: 100%;
	padding: 10px 10px 10px 2.25rem;
	border: 1px solid var(--color-light);
	border-radius: 6px;
	font-size: 0.875rem;
	transition: border-color 0.2s ease;
}

.search-input:focus {
	outline: none;
	border-color: var(--color-second);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Publication list */
.publication-list {
	max-height: 15rem;
	overflow-y: auto;
}

.no-results {
	padding: 1rem;
	text-align: center;
	color: #6b7280;
	font-size: 0.875rem;
}

.publication-item {
	width: 100%;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem;
	border: none;
	background: none;
	cursor: pointer;
	transition: background-color 0.2s ease;
	text-align: left;
}

.publication-item:hover {
	background: #f3f4f6;
}

.publication-item:focus {
	outline: none;
	background: #f3f4f6;
}

.publication-item--selected {
	background: #eff6ff;
}

.check-icon {
	width: 1rem;
	height: 1rem;
	color: var(--color-second);
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
	margin-left: auto;
}

/* Selected info */
.selected-info {
	margin-top: 1.5rem;
	padding: 1rem;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	background: #f9fafb;
}

.selected-title {
	font-weight: 600;
	margin-bottom: 0.5rem;
	color: var(--color-second);
	font-size: 0.875rem;
}

.selected-publication {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.selected-details {
	display: flex;
	flex-direction: column;
}

.selected-name {
	font-weight: 500;
	color: var(--color-second);
	margin: 0 0 0.25rem 0;
}

.selected-email {
	font-size: 0.875rem;
	color: #4b5563;
	margin: 0 0 0.25rem 0;
}

.selected-id {
	font-size: 0.75rem;
	color: #6b7280;
	margin: 0;
}

/* Overlay */
.overlay {
	position: fixed;
	inset: 0;
	z-index: 5;
	background: rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 640px) {
	.app-container {
		padding: 1rem;
	}

	.select-container {
		padding: 1.5rem;
	}
}
</style>
