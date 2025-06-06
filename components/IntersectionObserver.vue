<script setup lang="ts">
import {
	ref,
	onMounted,
	onBeforeUnmount,
	defineProps,
	defineEmits,
	watch,
} from 'vue'

interface IntersectionObserverOptions {
	root?: Element | null
	rootMargin?: string
	threshold?: number | number[]
}

const props = defineProps<{
	options?: IntersectionObserverOptions
}>()

const emit = defineEmits<(e: 'enter' | 'leave') => void>()

const intersectionEl = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function cleanupObserver() {
	if (observer && intersectionEl.value) {
		observer.unobserve(intersectionEl.value)
		observer.disconnect()
		observer = null
	}
}

function setupObserver() {
	if (!intersectionEl.value) return

	cleanupObserver()

	observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				emit('enter')
			} else {
				emit('leave')
			}
		})
	}, props.options)

	observer.observe(intersectionEl.value)
}

onMounted(() => {
	setupObserver()
})

onBeforeUnmount(() => {
	cleanupObserver()
})

// Re-setup observer if options change
watch(
	() => props.options,
	() => {
		setupObserver()
	},
)
</script>

<template>
	<div ref="intersectionEl">
		<slot />
	</div>
</template>

<style scoped>
div {
	display: flex;
	justify-content: center;
	width: 100%;
}
</style>
