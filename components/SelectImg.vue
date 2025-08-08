<script lang="ts" setup>
import type { Design } from '~/models/design/design.model'

const props = defineProps<{
	id: string
	items: Array<Design> | undefined
	value: Design | undefined
}>()

const emit = defineEmits<{
	(e: 'update:value', v: Design | undefined): void
}>()

const isOpen = ref(false)
const selectedDesign = ref<Design | undefined>(undefined)

const toggleDropdown = () => {
	isOpen.value = !isOpen.value
}

const closeDropdown = () => {
	isOpen.value = false
}

const selectItem = (design: Design) => {
	selectedDesign.value = design
	emit('update:value', design)
	closeDropdown()
}

const handleKeydown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && isOpen.value) {
		closeDropdown()
	}
}

watch(
	() => props.value,
	(newValue) => {
		if (newValue && newValue.id !== selectedDesign.value?.id) {
			selectedDesign.value = newValue
		} else if (!newValue) {
			selectedDesign.value = undefined
		}
	},
	{ immediate: true },
)

onBeforeMount(() => {
	if (props.value) {
		selectedDesign.value = props.value
	}
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
	<div class="form-group">
		<!-- Trigger -->
		<div class="select-wrapper">
			<button
				type="button"
				class="select-trigger"
				:class="{ 'select-trigger--open': isOpen }"
				@click="toggleDropdown"
			>
				<div v-if="!selectedDesign" class="user-display">
					<div class="user-info">
						<span>{{ $t('common.selectDesign') }}</span>
					</div>
				</div>
				<div v-else class="design-display">
					<HTMLImg
						size="sm"
						:image="selectedDesign.image.key"
						:from-provider="true"
						contain="contain"
					/>
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
				<div
					v-if="props.items"
					class="item-list"
					style="overflow-x: auto; max-height: 15rem"
				>
					<button
						v-for="item in props.items"
						:key="item.id"
						type="button"
						class="item"
						:class="{
							'item--selected': selectedDesign?.id === item.id,
						}"
						:disabled="selectedDesign?.id === item.id"
						@click="selectItem(item)"
					>
						<div class="item-img">
							<HTMLImg
								size="s"
								:image="item.image.key"
								:from-provider="true"
								contain="contain"
								img-hover
							/>
							<span class="selection-indicator"></span>
						</div>
					</button>
				</div>
				<span v-else>{{ $t('design.noDesign') }}</span>
			</div>
		</div>

		<!-- Overlay -->
		<div v-if="isOpen" class="overlay" @click="closeDropdown"></div>
	</div>
</template>

<style scoped>
.form-group {
	margin-bottom: 0.5rem;
	height: 50%;
}
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
.design-display {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}
.select-trigger--open {
	border-color: var(--color-second);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
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
.item-list {
	max-height: 15rem;
	overflow-y: hidden;
	overflow-x: auto;
	display: flex;
	scroll-behavior: smooth;
	gap: 0.5rem;
	padding: 0 4px;
	scrollbar-width: thin;
	scrollbar-color: #ccc transparent;
}
.item-list::-webkit-scrollbar-thumb {
	background: #ccc;
	border-radius: 4px;
}
.item-list::-webkit-scrollbar-track {
	background: transparent;
}
.item {
	display: flex;
	position: relative;
	align-items: center;
	gap: 0.75rem;
	padding: 0.25rem;
	border: none;
	border-radius: 8px;
	background: none;
	cursor: pointer;
	transition: background-color 0.2s ease;
}
.selection-indicator {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 50%;
	translate: 50%;
	height: 3px;
	background-color: transparent;
	pointer-events: none;
}
.item--selected {
	cursor: not-allowed;
}
.item--selected .selection-indicator {
	background-color: var(--color-main);
}
</style>
