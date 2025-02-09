<script setup lang="ts">
// Items
import type { Component } from 'vue'
import { PhCaretLeft, PhCaretRight } from '@phosphor-icons/vue'

defineProps<{
	items: Array<{
		icon: Component
		text: string
		to: string
	}>
}>()

const scrollContainer = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
const maxScroll = ref(0)

const scroll = (direction: string) => {
	const container = scrollContainer.value
	if (!container) return
	const scrollAmount = container.clientWidth / 2

	if (direction === 'left') {
		container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
	} else {
		container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
	}
}

const updateScrollPosition = () => {
	const container = scrollContainer.value
	if (!container) return
	scrollPosition.value = container.scrollLeft
	maxScroll.value = container.scrollWidth - container.clientWidth
}

onMounted(() => {
	updateScrollPosition()
})
</script>

<template>
	<nav class="HorizontalNav">
		<button
			:disabled="scrollPosition <= 0"
			class="nav-button left"
			@click="scroll('left')"
		>
			<PhCaretLeft />
		</button>
		<div class="HorizontalNav__Container">
			<div class="HorizontalNav__Container--scroll">
				<div
					ref="scrollContainer"
					class="HorizontalNav__Scroll--item"
					@scroll="updateScrollPosition"
				>
					<div class="HorizontalNav__Item--wrapper">
						<HTMLSimpleAnchor
							v-for="(item, i) in items"
							:key="i"
							:to="item.to"
							class="item"
						>
							<component :is="item.icon" height="20" />
							<p>{{ item.text }}</p>
						</HTMLSimpleAnchor>
					</div>
				</div>
			</div>
		</div>
		<button
			class="nav-button right"
			:disabled="scrollPosition >= maxScroll"
			@click="scroll('right')"
		>
			<PhCaretRight />
		</button>
	</nav>
</template>

<style scoped>
.HorizontalNav {
	position: relative;
	display: flex;
	justify-content: center;
	button {
		display: none;
	}
	border-bottom: 1px solid var(--color-light);
}

a {
	text-decoration: none;
}

.HorizontalNav__Container {
	max-width: calc(100vw - 20px);
}

.HorizontalNav__Container--scroll {
	position: relative;
}

.HorizontalNav__Scroll--item {
	overflow-x: auto;
	white-space: nowrap;
	scroll-behavior: smooth;
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.HorizontalNav__Scroll--item::-webkit-scrollbar {
	display: none;
}

.HorizontalNav__Item--wrapper {
	display: inline-flex;
	gap: 1rem;
}

.item {
	width: fit-content;
	flex-shrink: 0;
	background-color: var(--background-color);
	border-radius: 8px;
	box-shadow: 0 4px 6px var(--shadow-color);
	padding: 4px;
	display: flex;
	align-items: center;
	flex-direction: column;
	transition: transform 0.3s ease;
	position: relative;
}

.item:hover {
	transform: scale(1.05);
}

.nav-button {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background-color: var(--background-color);
	border: none;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 2px 4px var(--shadow-color);
	cursor: pointer;
	z-index: 10;
}

.nav-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.nav-button.left {
	left: 0;
}

.nav-button.right {
	right: 0;
}

.nav-button svg {
	width: 24px;
	height: 24px;
	color: var(--primary-color);
}
</style>
