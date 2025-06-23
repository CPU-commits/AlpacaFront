<script setup lang="ts">
const props = defineProps<{
	opened: boolean

	fn?: () => any
}>()

const opened = toRef(props, 'opened')
watch(opened, (newValue) => {
	if (!newValue) {
		document.body.classList.remove('Modal__open')
	} else {
		document.body.classList.add('Modal__open')
	}
})
// Ref
const scroll = ref(0)
const content: Ref<HTMLElement | null> = ref(null)
const asideEl: Ref<HTMLElement | null> = ref(null)
const emits = defineEmits(['update:opened', 'update:close'])

onUpdated(() => {
	const B = document.body
	let D = document.documentElement
	D = D.clientHeight ? D : B

	scroll.value = D.scrollTop

	if (asideEl.value) {
		asideEl.value.style.setProperty('--top', `${scroll.value}px`)
	}
})

onBeforeUnmount(() => {
	document.body.classList.remove('Modal__open')
})

const closeModal = () => {
	if (props.fn) props.fn()
	emits('update:opened', false)
	emits('update:close')
}
</script>

<template>
	<Teleport to="body">
		<aside v-if="opened" ref="asideEl" class="Modal">
			<div ref="content" class="Modal__container">
				<section>
					<header class="Modal__header">
						<slot name="title" />
						<i
							class="fa-solid fa-xmark"
							@click="() => closeModal()"
						/>
					</header>
					<section class="Modal__content">
						<slot />
					</section>
				</section>
			</div>
		</aside>
	</Teleport>
</template>

<style scoped>
.Modal {
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1000;
	background: rgba(0, 0, 0, 0.4);
	display: flex;
	justify-content: center;
	left: 0;
	align-items: center;
	top: var(--top);
}

.dark-mode .Modal__container {
	background-color: var(--color-main-dark-contrast);
}

.Modal__container {
	background-color: white;
	max-height: 80%;
	position: absolute;
	top: calc(15vh);
	max-height: calc(100vh - 50px);
	overflow-y: auto;
	overflow-x: hidden;
	width: 60%;
	border-radius: 4px;
	animation: modal 0.4s;
}

.Modal__header {
	padding: 20px;
	display: flex;
	justify-content: center;
}

.Modal__header i {
	position: absolute;
	right: 20px;
	top: 20px;
	font-size: 1.1rem;
	cursor: pointer;
}

.Modal__content {
	display: flex;
	width: 100%;
	flex-direction: column;
	padding: 30px;
	box-sizing: border-box;
}

@keyframes modal {
	0% {
		opacity: 0;
		top: 12vh;
	}
	100% {
		opacity: 1;
		top: calc(15vh);
	}
}

@media (max-width: 500px) {
	.Modal__container {
		width: 90%;
	}

	.Modal__header {
		padding: 15px 5px;
	}

	.Modal__content {
		padding: 0 20px;
		padding-bottom: 30px;
	}
}

@media (min-width: 500px) and (max-width: 575.98px) {
	.Modal__container {
		width: 80%;
	}

	.Modal__content {
		padding: 20px;
	}
}

@media (min-width: 575.98px) and (max-width: 750px) {
	.Modal__container {
		width: 80%;
	}

	.Modal__content {
		padding: 20px;
	}
}
</style>
