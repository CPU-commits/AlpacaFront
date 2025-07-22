<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		opened: boolean
		fn?: () => any | null
	}>(),
	{ fn: () => null },
)

const opened = toRef(props, 'opened')
const emits = defineEmits(['update:opened', 'update:close'])

const closeModal = () => {
	if (props.fn) props.fn()
	emits('update:opened', false)
	emits('update:close')
}

onBeforeUnmount(() => {
	document.body.classList.remove('Modal__open')
})

watch(opened, (val) => {
	if (val) {
		document.body.classList.add('Modal__open')
	} else {
		document.body.classList.remove('Modal__open')
	}
})
</script>

<template>
	<Teleport to="body">
		<aside v-if="opened" class="ImageModal">
			<i class="fa-solid fa-xmark close-icon" @click="closeModal" />
			<div class="ImageModal__content">
				<slot />
			</div>
		</aside>
	</Teleport>
</template>

<style scoped>
.ImageModal {
	position: fixed;
	inset: 0;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.8);
	transition: background-color 0.3s ease;
}

.ImageModal__content {
	width: 90%;
	height: 90%;
	padding: 2rem;
	display: flex;
	justify-content: center;
	align-items: center;
}

.close-icon {
	position: absolute;
	top: 20px;
	right: 20px;
	font-size: 2.5rem;
	color: #fff;
	cursor: pointer;
	z-index: 1100;
}

.close-icon:hover {
	color: var(--color-main);
}
</style>
