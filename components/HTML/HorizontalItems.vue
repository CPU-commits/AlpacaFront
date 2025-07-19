<template>
	<div class="conveyor-container">
		<!-- Botón izquierdo -->
		<button
			v-if="showLeftButton"
			class="scroll-button scroll-button-left"
			:disabled="isAtStart"
			@click="scrollLeft"
		>
			<i class="fa-solid fa-chevron-left"></i>
		</button>

		<!-- Contenedor de items -->
		<div ref="scrollContainer" class="conveyor-belt" @scroll="handleScroll">
			<div class="conveyor-content">
				<slot></slot>
			</div>
		</div>

		<!-- Botón derecho -->
		<button
			v-if="showRightButton"
			class="scroll-button scroll-button-right"
			:disabled="isAtEnd"
			@click="scrollRight"
		>
			<i class="fa-solid fa-chevron-right"></i>
		</button>
	</div>
</template>

<script setup>
// Props
const props = defineProps({
	scrollAmount: {
		type: Number,
		default: 200,
	},
	showButtons: {
		type: String,
		default: 'auto', // 'auto', 'always', 'never'
		validator: (value) => ['auto', 'always', 'never'].includes(value),
	},
})

// Refs
const scrollContainer = ref(null)
const showLeftButton = ref(false)
const showRightButton = ref(false)
const isAtStart = ref(true)
const isAtEnd = ref(false)

// Métodos de scroll
const scrollLeft = () => {
	if (scrollContainer.value) {
		scrollContainer.value.scrollBy({
			left: -props.scrollAmount,
			behavior: 'smooth',
		})
	}
}

const scrollRight = () => {
	if (scrollContainer.value) {
		scrollContainer.value.scrollBy({
			left: props.scrollAmount,
			behavior: 'smooth',
		})
	}
}

// Manejar el evento de scroll
const handleScroll = () => {
	if (!scrollContainer.value) return

	const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value

	isAtStart.value = scrollLeft <= 0
	isAtEnd.value = scrollLeft >= scrollWidth - clientWidth - 1
}

// Verificar si necesita botones de navegación
const checkOverflow = () => {
	if (!scrollContainer.value) return

	const { scrollWidth, clientWidth } = scrollContainer.value
	const hasOverflow = scrollWidth > clientWidth

	if (props.showButtons === 'always') {
		showLeftButton.value = true
		showRightButton.value = true
	} else if (props.showButtons === 'never') {
		showLeftButton.value = false
		showRightButton.value = false
	} else {
		showLeftButton.value = hasOverflow
		showRightButton.value = hasOverflow
	}

	handleScroll()
}

// Observer para cambios en el contenido
let resizeObserver = null

onMounted(async () => {
	await nextTick()
	checkOverflow()

	// Observar cambios de tamaño
	if (window.ResizeObserver) {
		resizeObserver = new ResizeObserver(() => {
			checkOverflow()
		})

		if (scrollContainer.value) {
			resizeObserver.observe(scrollContainer.value)
		}
	}

	// Escuchar cambios de ventana
	window.addEventListener('resize', checkOverflow)
})

onUnmounted(() => {
	if (resizeObserver) {
		resizeObserver.disconnect()
	}
	window.removeEventListener('resize', checkOverflow)
})

// Exponer métodos para uso externo
defineExpose({
	scrollLeft,
	scrollRight,
	scrollToStart: () => {
		if (scrollContainer.value) {
			scrollContainer.value.scrollTo({ left: 0, behavior: 'smooth' })
		}
	},
	scrollToEnd: () => {
		if (scrollContainer.value) {
			scrollContainer.value.scrollTo({
				left: scrollContainer.value.scrollWidth,
				behavior: 'smooth',
			})
		}
	},
})
</script>

<style scoped>
.conveyor-container {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
}

.conveyor-belt {
	padding-bottom: 1rem;
	flex: 1;
	overflow-x: auto;
	overflow-y: hidden;
	scroll-behavior: smooth;
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* IE/Edge */
}

.conveyor-belt::-webkit-scrollbar {
	display: none; /* Chrome/Safari */
}

.conveyor-content {
	display: flex;
	gap: 1rem;
	padding: 0.5rem 0;
	min-width: min-content;
}

.scroll-button {
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	z-index: 10;
	width: 40px;
	height: 40px;
	border: none;
	border-radius: 50%;
	background: var(--color-bg);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.scroll-button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.scroll-button-left {
	left: -20px;
}

.scroll-button-right {
	right: -20px;
}

/* Estilos para items dentro del slot */
.conveyor-content > :deep(*) {
	flex-shrink: 0;
}
</style>
