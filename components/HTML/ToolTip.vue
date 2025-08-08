<script setup lang="ts">
const props = defineProps<{
	text: string
	position?: 'top' | 'bottom' | 'left' | 'right'
}>()

const show = ref(false)
const position = props.position || 'top'

const tooltipPositionClass = computed(() => `tooltip-${position}`)
const arrowClass = computed(() => `tooltip-arrow tooltip-arrow-${position}`)
const transitionName = computed(() => {
	switch (position) {
		case 'top':
			return 'tooltip-top'
		case 'bottom':
			return 'tooltip-bottom'
		case 'left':
			return 'tooltip-left'
		case 'right':
			return 'tooltip-right'
		default:
			return 'tooltip-top'
	}
})
</script>
<template>
	<div
		class="tooltip-wrapper"
		@mouseenter="show = true"
		@mouseleave="show = false"
	>
		<slot />
		<Transition :name="transitionName">
			<div v-if="show" class="tooltip" :class="tooltipPositionClass">
				<span class="tooltip-text">{{ text }}</span>
				<div :class="arrowClass"></div>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.tooltip-wrapper {
	position: relative;
	display: inline-block;
}

/* Tooltip box */
.tooltip {
	position: absolute;
	display: flex;
	background-color: var(--color-light);
	padding: 8px;
	border-radius: 6px;
	font-size: 14px;
	white-space: nowrap;
	align-items: center;
	justify-content: center;
	z-index: 10;
	box-shadow: var(--box-shadow);
}

/* Tooltip text */
.tooltip-text {
	z-index: 2;
}

/* Positions */
.tooltip-top {
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%) translateY(-8px);
}

.tooltip-arrow-top {
	top: 100%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%) rotate(45deg);
}

.tooltip-bottom {
	top: 100%;
	left: 50%;
	transform: translateX(-50%) translateY(8px);
}

.tooltip-arrow-bottom {
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%) translateY(50%) rotate(45deg);
}

.tooltip-left {
	right: 100%;
	top: 50%;
	transform: translateX(-8px) translateY(-50%);
}

.tooltip-arrow-left {
	left: 100%;
	top: 50%;
	transform: translateX(-50%) translateY(-50%) rotate(45deg);
}

.tooltip-right {
	left: 100%;
	top: 50%;
	transform: translateX(8px) translateY(-50%);
}

.tooltip-arrow-right {
	right: 100%;
	top: 50%;
	transform: translateX(50%) translateY(-50%) rotate(45deg);
}
/* Base transition style */
.tooltip-top-enter-active,
.tooltip-top-leave-active,
.tooltip-bottom-enter-active,
.tooltip-bottom-leave-active,
.tooltip-left-enter-active,
.tooltip-left-leave-active,
.tooltip-right-enter-active,
.tooltip-right-leave-active {
	transition: all 0.2s ease;
	opacity: 1;
}

/* TOP */
.tooltip-top-enter-from,
.tooltip-top-leave-to {
	opacity: 0;
	transform: translateX(-50%) translateY(-20px);
}
.tooltip-top-enter-to,
.tooltip-top-leave-from {
	transform: translateX(-50%) translateY(-8px);
}

/* BOTTOM */
.tooltip-bottom-enter-from,
.tooltip-bottom-leave-to {
	opacity: 0;
	transform: translateX(-50%) translateY(20px);
}
.tooltip-bottom-enter-to,
.tooltip-bottom-leave-from {
	transform: translateX(-50%) translateY(8px);
}

/* LEFT */
.tooltip-left-enter-from,
.tooltip-left-leave-to {
	opacity: 0;
	transform: translateX(-20px) translateY(-50%);
}
.tooltip-left-enter-to,
.tooltip-left-leave-from {
	transform: translateX(-8px) translateY(-50%);
}

/* RIGHT */
.tooltip-right-enter-from,
.tooltip-right-leave-to {
	opacity: 0;
	transform: translateX(20px) translateY(-50%);
}
.tooltip-right-enter-to,
.tooltip-right-leave-from {
	transform: translateX(8px) translateY(-50%);
}
</style>
